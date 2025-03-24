"use server";
import { auth } from "@/auth";
import { pool } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function publishCollection(colelctionId: string) {

  const session = await auth()
  if (!session || !session.user || !session.user.id) {
    console.error("Failed to create collection");
    return;
  }

  try {

    const { rows } = await pool.query(
      `UPDATE collections SET is_public = true WHERE id = $1 RETURNING *`,
      [colelctionId]
    );

    revalidatePath("/");
    return rows[0]; 
  } catch (error) {
    console.error("Error adding collection:", error);
    throw error;
  }
}
