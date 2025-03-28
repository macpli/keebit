"use server";
import { auth } from "@/auth";
import { pool } from "@/lib/db";

export async function getFollowers(userId: string) {

  const session = await auth()
  if (!session || !session.user || !session.user.id) {
    console.error("Failed to create collection");
    return;
  }

  try {
    const { rows } = await pool.query(
      `
      SELECT 
        (SELECT COUNT(id) FROM followers WHERE followed_id = $1) AS followers,
        (SELECT COUNT(id) FROM followers WHERE follower_id = $1) AS follows
      `,
      [userId]
    );

    return rows[0]; 
  } catch (error) {
    console.error("Error adding collection:", error);
    throw error;
  }
}
