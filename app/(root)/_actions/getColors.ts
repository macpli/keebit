'use server'
import { pool } from "@/lib/db";
import { auth } from "@/auth";

export async function getColors(itemId: string) {
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
      throw new Error("User not authenticated");

    }

    
  try {
    const { rows } = await pool.query(
        `SELECT * FROM model_colors WHERE user_id = $1 AND item_id = $2 ORDER BY material_index ASC`,
        [session?.user?.id, itemId]    );

    return rows;
  } catch (error) {
    console.error("Error getting colors:", error);
    throw error;
  }
}