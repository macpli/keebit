import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port: 5432,
});

// Fetch collections for a specific user
export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const { userId } = params;

  try {
    const { rows: collections } = await pool.query(
      "SELECT * FROM collections WHERE user_id = $1",
      [userId]
    );

    return NextResponse.json({ collection: collections });
  } catch (error) {
    console.error("Database query failed", error);
    return NextResponse.json({ error: "Failed to fetch collections" }, { status: 500 });
  }
}
