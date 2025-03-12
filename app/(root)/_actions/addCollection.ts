  "use server";
import { auth } from "@/auth";
import { pool } from "@/lib/db";

export async function addCollection(formData: FormData) {
  const session = await auth()
  if (!session || !session.user || !session.user.id) {
    console.error("Failed to create collection");
    return;
  }
  
  try {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;

    if (!name || !description) {
      throw new Error("Name and description are required");
    }

    const { rows } = await pool.query(
      `INSERT INTO collections ("userId", name, description) VALUES ($1, $2, $3) RETURNING *`,
      [session.user.id, name, description]
    );

    return rows[0]; 
  } catch (error) {
    console.error("Error adding collection:", error);
    throw error;
  }
}
