// src/lib/prisma.ts
import { PrismaClient } from '../generated/prisma/client'; // Import from local folder!


const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasource: {
      url: process.env.POSTGRES_PRISMA_URL,
    },
  } as any);

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;