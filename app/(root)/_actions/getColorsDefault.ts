'use server'
import { pool } from "@/lib/db";
import { auth } from "@/auth";

export async function getColorsDefault(itemType: string) {
    
  try {
    const { rows } = await pool.query(
        `SELECT * FROM model_colors WHERE model_name = $1 AND is_default = true ORDER BY material_index ASC`,
        [itemType]    );

    return rows;
  } catch (error) {
    console.error("Error getting colors:", error);
    throw error;
  }
}