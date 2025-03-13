  "use server";
import { auth } from "@/auth";
import { pool } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function addCollection(formData: FormData) {
  const session = await auth()
  if (!session || !session.user || !session.user.id) {
    console.error("Failed to create collection");
    return;
  }
  
  try {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const imageBase64 = formData.get('imageBase64') as string;

    if (!name || !description) {
      throw new Error("Name and description are required");
    }

    const { rows } = await pool.query(
      `INSERT INTO collections ("userId", name, description, image) VALUES ($1, $2, $3, $4) RETURNING *`,
      [session.user.id, name, description, imageBase64]
    );

    revalidatePath("/");
    return rows[0]; 
  } catch (error) {
    console.error("Error adding collection:", error);
    throw error;
  }
}
