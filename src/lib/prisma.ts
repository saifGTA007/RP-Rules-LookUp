// src/lib/prisma.ts
import { PrismaClient } from '../generated/prisma/client'; // Import from local folder!


const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    // Explicitly pass the URL to the constructor for Prisma 7
    datasource: {
      url: process.env.POSTGRES_PRISMA_URL,
    },
  } as any); // Type cast may be needed if TS complains about the new config structure

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;