import { Pool } from 'pg';

declare global {
  // eslint-disable-next-line no-var
  var __pgPool: Pool | undefined;
}

const connectionString =
  process.env.DATABASE_URL || 'postgresql://postgres:x@localhost:54329/postgres';

export const pool =
  globalThis.__pgPool ||
  new Pool({
    connectionString,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });

if (process.env.NODE_ENV !== 'production') {
  globalThis.__pgPool = pool;
}

export type SqlParam = string | number | boolean | null;

export async function query<T = Record<string, unknown>>(text: string, params?: SqlParam[]): Promise<T[]> {
  const res = await pool.query(text, params);
  return res.rows as T[];
}
