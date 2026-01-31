import { defineConfig } from '@prisma/config';

export default defineConfig({
  datasource: {
    // We check both the Vercel name and the standard name
    url: process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL,
  },
});