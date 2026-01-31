// src/lib/prisma.ts
import { PrismaClient } from '../generated/prisma/client'; // Import from local folder!
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const connectionString = process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL;

// Set up the connection pool and adapter
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter: adapter, // Prisma 7 uses this instead of 'datasource'
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;