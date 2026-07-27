import { PrismaClient } from '@prisma/client';
import { logger } from '../logger/logger';

export const prisma = new PrismaClient({
  log: [
    { emit: 'event', level: 'query' },
    { emit: 'event', level: 'error' },
    { emit: 'event', level: 'warn' },
  ],
});

if (process.env.NODE_ENV === 'development') {
  prisma.$on('query' as never, (e: any) => {
    logger.debug({ query: e.query, params: e.params, duration: `${e.duration}ms` }, 'Prisma Query');
  });
}

prisma.$on('error' as never, (e: any) => {
  logger.error({ message: e.message }, 'Prisma Error');
});
