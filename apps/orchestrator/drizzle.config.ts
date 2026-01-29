import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';

// Load environment variables from root .env
dotenv.config({ path: '../../.env' });

export default {
  schema: ['./src/db/schema.ts', './src/db/schema-meetings.ts', './src/db/schema-templates.ts'],
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
