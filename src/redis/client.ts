import Redis from 'ioredis';
import { config } from '../config';
import { logger } from '../logger/logger';

let isRedisConnected = false;

export const redis = new Redis({
  host: config.redis.host === 'localhost' ? '127.0.0.1' : config.redis.host,
  port: config.redis.port,
  password: config.redis.password || undefined,
  db: config.redis.db,
  lazyConnect: true,
  maxRetriesPerRequest: 1,
  enableOfflineQueue: false,
  retryStrategy(times) {
    if (times > 3) {
      logger.warn('Redis connection retries exhausted. Running in offline/mock cache mode.');
      return null; // Stop retrying after 3 attempts
    }
    return 1000;
  },
});

redis.on('connect', () => {
  isRedisConnected = true;
  logger.info('Connected to Redis server successfully');
});

redis.on('error', (err) => {
  isRedisConnected = false;
  // Silently suppress repetitive ECONNREFUSED error spam when Redis is not running locally
  if ((err as any)?.code === 'ECONNREFUSED') {
    logger.warn('Redis is offline or not running on port 6379. Redis caching disabled.');
  } else {
    logger.error({ err }, 'Redis Error');
  }
});

// Proactively attempt connection once on startup without crashing
redis.connect().catch(() => {
  // Ignored on startup - fallback mode activated
});

export class RedisService {
  public static async get<T>(key: string): Promise<T | null> {
    if (!isRedisConnected) return null;
    try {
      const data = await redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      return null;
    }
  }

  public static async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    if (!isRedisConnected) return;
    try {
      const stringified = JSON.stringify(value);
      if (ttlSeconds) {
        await redis.set(key, stringified, 'EX', ttlSeconds);
      } else {
        await redis.set(key, stringified);
      }
    } catch (err) {
      // Ignored in fallback mode
    }
  }

  public static async del(key: string): Promise<void> {
    if (!isRedisConnected) return;
    try {
      await redis.del(key);
    } catch (err) {
      // Ignored
    }
  }

  public static async delPattern(pattern: string): Promise<void> {
    if (!isRedisConnected) return;
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (err) {
      // Ignored
    }
  }
}
