"use server";
import { pool } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteCollection( collectionId: string ) {
  try {
    const { rows } = await pool.query(
      `DELETE FROM collections WHERE id =  $1 RETURNING *`,
      [ collectionId]
    );

    revalidatePath("/"); 
    return rows[0]; 
  } catch (error) {
    console.error("Error adding collection:", error);
    throw error;
  }
}
