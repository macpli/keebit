"use server";
import { auth } from "@/auth";
import { pool } from "@/lib/db";

export async function getCollectionsCount(userId: string) {

  const session = await auth()
  if (!session || !session.user || !session.user.id) {
    console.error("Failed to create collection");
    return;
  }

  try {
    const { rows } = await pool.query(
      `
        SELECT COUNT(*) FROM collections WHERE "userId" = $1
      `,
      [userId]
    );

    return rows[0]; 
  } catch (error) {
    console.error("Error adding collection:", error);
    throw error;
  }
}
