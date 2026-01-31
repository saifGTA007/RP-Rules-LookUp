import { defineConfig } from '@prisma/config';

export default defineConfig({
  datasource: {
    // Check all possible variable names
    url: process.env.POSTGRES_URL,
  },
});