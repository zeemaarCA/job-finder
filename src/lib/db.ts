import { PrismaClient } from '@prisma/client';

declare global {
  // Prevent multiple PrismaClient instances in development
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export const db = prisma;
