import { defineConfig } from '@prisma/config';

export default defineConfig({
  datasource: {
    // Check all possible variable names
    url: process.env.PRISMA_DATABASE_URL || process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL,
  },
});