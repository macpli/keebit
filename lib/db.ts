import { Pool } from 'pg';

// Sprawdzamy czy nie jesteśmy w środowisku produkcyjnym
const globalForPg = global as unknown as { pool: Pool }

// Tworzymy pojedynczą instancję poola
export const pool =
  globalForPg.pool ||
  new Pool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    port: process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT, 10) : undefined,
  })

// W trybie development zapisujemy pool w zmiennej globalnej
if (process.env.NODE_ENV !== 'production') globalForPg.pool = pool