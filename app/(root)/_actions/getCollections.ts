"use server";
import { pool } from "@/lib/db";
import { auth } from "@/auth";

export default async function getCollections(userId: string) {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM collections WHERE "userId" = $1`,
      [userId]
    );

    return rows;
  } catch (error) {
    console.error("Error getting colors:", error);
    throw error;
  }
}
