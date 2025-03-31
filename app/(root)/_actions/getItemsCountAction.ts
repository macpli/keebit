"use server";
import { auth } from "@/auth";
import { pool } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getItemsCountAction(collectionId: string) {

  const session = await auth()
  if (!session || !session.user || !session.user.id) {
    console.error("Failed to create collection");
    return;
  }

  try {
    const { rows } = await pool.query(
      `SELECT COUNT(id) FROM items WHERE "collectionId" = $1`,
      [ collectionId]
    );

    revalidatePath("/");
    return rows[0]; 
  } catch (error) {
    console.error("Error adding collection:", error);
    throw error;
  }
}
