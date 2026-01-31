import { defineConfig } from '@prisma/config';

export default defineConfig({
  datasource: {
    // This will grab the URL Vercel creates for you
    url: process.env.POSTGRES_PRISMA_URL,
  },
});