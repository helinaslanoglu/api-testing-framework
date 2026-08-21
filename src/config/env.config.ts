import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env file if present
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export interface AppConfig {
  baseUrl: string;
  defaultUsername: string;
  defaultPassword: string;
  timeout: number;
}

export const config: AppConfig = {
  baseUrl: process.env.API_BASE_URL || 'https://dummyjson.com',
  defaultUsername: process.env.API_USERNAME || 'emilys',
  defaultPassword: process.env.API_PASSWORD || 'emilyspass',
  timeout: parseInt(process.env.API_TIMEOUT || '30000', 10),
};
