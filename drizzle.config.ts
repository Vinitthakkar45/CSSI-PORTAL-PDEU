import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/drizzle/schema.ts',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
