import { pool } from "@/lib/db";

export async function addCollection({ name, description, userId }: { name: string; description: string, userId: string }) {
  try {
    const { rows } = await pool.query(
      `INSERT INTO collections ("userId", name, description) VALUES ($1, $2, $3) RETURNING *`,
      [userId, name, description]
    );

    return rows[0]; // Zwracamy nowo dodany obiekt
  } catch (error) {
    console.error("Error adding collection:", error);
    throw error;
  }
}
