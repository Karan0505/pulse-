import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import pinoHttp from 'pino-http';
import path from 'path';
import { config } from './config';
import { logger } from './logger/logger';
import { upload, handleFileUpload } from './controllers/uploadController';

export const createApp = () => {
  const app = express();

  // Security headers
  app.use(
    helmet({
      contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
      crossOriginEmbedderPolicy: false,
    })
  );

  // CORS configuration
  app.use(
    cors({
      origin: '*', // Allow all origins for dev flexibility
      credentials: true,
    })
  );

  // Compression
  app.use(compression());

  // JSON parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // HTTP Request Logging
  app.use(pinoHttp({ logger }));

  // Rate Limiter
  const limiter = rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.max,
    message: { error: 'Too many requests from this IP, please try again later.' },
  });
  app.use(config.apiPrefix, limiter);

  // Static uploads directory
  app.use('/uploads', express.static(config.storage.uploadDir));

  // Root landing page
  app.get('/', (_req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Pulse GraphQL Backend</title>
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; background: #0f172a; color: #f8fafc; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }
          .card { background: #1e293b; padding: 2.5rem; border-radius: 1rem; box-shadow: 0 10px 25px rgba(0,0,0,0.5); text-align: center; max-width: 480px; width: 100%; border: 1px solid #334155; }
          h1 { color: #38bdf8; margin-top: 0; font-size: 1.8rem; }
          p { color: #94a3b8; font-size: 0.95rem; line-height: 1.5; }
          .btn { display: inline-block; margin: 0.5rem; padding: 0.75rem 1.5rem; background: #0284c7; color: white; border-radius: 0.5rem; text-decoration: none; font-weight: 600; transition: all 0.2s; }
          .btn:hover { background: #0369a1; transform: translateY(-1px); }
          .btn-secondary { background: #334155; color: #e2e8f0; }
          .btn-secondary:hover { background: #475569; }
          .status { display: inline-flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; color: #4ade80; background: rgba(74,222,128,0.1); padding: 0.25rem 0.75rem; border-radius: 1rem; margin-bottom: 1.5rem; }
          .dot { width: 8px; height: 8px; background: #4ade80; border-radius: 50%; display: inline-block; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="status"><span class="dot"></span> Server Active</div>
          <h1>Pulse GraphQL Server</h1>
          <p>Production-ready GraphQL API powered by Node.js, Express, Apollo Server, Prisma, PostgreSQL & Redis.</p>
          <div style="margin-top: 1.5rem;">
            <a href="/graphql" class="btn">Launch GraphQL Explorer 🚀</a>
            <a href="/health" class="btn btn-secondary">Health Check 🟢</a>
          </div>
        </div>
      </body>
      </html>
    `);
  });

  // REST API Routes
  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString(), app: config.appName });
  });

  app.post(`${config.apiPrefix}/upload`, upload.single('file'), handleFileUpload);

  return app;
};
