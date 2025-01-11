import { pool } from "@/lib/db";

export async function deleteCollection({ collectionId }: { collectionId: string; }) {
  try {
    const { rows } = await pool.query(
      `DELETE FROM collections WHERE id =  $1 RETURNING *`,
      [ collectionId]
    );

    return rows[0]; // Zwracamy nowo dodany obiekt
  } catch (error) {
    console.error("Error adding collection:", error);
    throw error;
  }
}
