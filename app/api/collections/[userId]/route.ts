import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET(req: NextRequest, { 
  params,
}: { 
  params: Promise<{ userId: string }>
}) {
  const userId = (await params).userId;
  
  try {
    const { rows: collections } = await pool.query(
      `SELECT * FROM collections WHERE "userId" = $1`,  
      [userId]
    );

    return NextResponse.json({ collection: collections });
  } catch (error) {
    console.error("Database query failed", error);
    return NextResponse.json({ error: "Failed to fetch collections" }, { status: 500 });
  }
}
