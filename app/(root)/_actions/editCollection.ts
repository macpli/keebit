"use server";
import { auth } from "@/auth";
import { pool } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function editCollection(formData: FormData, collectionId: string) {

  const session = await auth()
  if (!session || !session.user || !session.user.id) {
    console.error("Failed to create collection");
    return;
  }

  try {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const imageBase64 = formData.get('imageBase64') as string;

    const { rows } = await pool.query(
      `UPDATE collections SET name = $1, description = $2, image = $3 WHERE id = $4 RETURNING *`,
      [name, description, imageBase64, collectionId]
    );

    revalidatePath("/");
    return rows[0]; 
  } catch (error) {
    console.error("Error adding collection:", error);
    throw error;
  }
}
