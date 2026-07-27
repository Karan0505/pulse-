import http from 'http';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { createApp } from './app';
import { config } from './config';
import { schema } from './graphql/schema';
import { createContext } from './graphql/context';
import { formatGraphQLError } from './errors';
import { logger } from './logger/logger';
import { prisma } from './prisma/client';
import { redis } from './redis/client';

async function startServer() {
  const app = createApp();
  const httpServer = http.createServer(app);

  // WebSocket Server for GraphQL Subscriptions (graphql-ws)
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: config.graphqlPath,
  });

  const serverCleanup = useServer(
    {
      schema,
      context: async (ctx) => {
        return {
          extra: ctx.extra,
        };
      },
    },
    wsServer
  );

  // Apollo Server Initialization
  const server = new ApolloServer({
    schema,
    formatError: formatGraphQLError,
    plugins: [
      // Apollo Sandbox landing page in browser
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
      // Proper shutdown for the HTTP server
      ApolloServerPluginDrainHttpServer({ httpServer }),
      // Proper shutdown for the WebSocket server
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start();

  // Attach Apollo GraphQL middleware to Express
  app.use(
    config.graphqlPath,
    expressMiddleware(server, {
      context: createContext,
    })
  );

  httpServer.listen(config.port, '0.0.0.0', () => {
    logger.info(`🚀 Server running in ${config.env} mode at http://localhost:${config.port}${config.graphqlPath}`);
    logger.info(`🌐 Landing page & Dashboard at http://localhost:${config.port}/`);
    logger.info(`📡 Subscriptions ready at ws://localhost:${config.port}${config.graphqlPath}`);
  });

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    logger.info(`Received ${signal}. Shutting down gracefully...`);
    await server.stop();
    await new Promise<void>((resolve) => httpServer.close(() => resolve()));
    await prisma.$disconnect();
    await redis.quit();
    logger.info('Server successfully closed. Goodbye!');
    process.exit(0);
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

startServer().catch((err) => {
  logger.fatal({ err }, 'Failed to start server');
  process.exit(1);
});
