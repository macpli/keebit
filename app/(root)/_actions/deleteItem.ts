"use server";
import { pool } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export default async function deleteItem(itemId: string) {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        console.error("Failed to create collection");
        return;
    }
    try {
        const { rows } = await pool.query(
            `DELETE FROM items WHERE id = $1 RETURNING *`,
            [itemId]
        );
        revalidatePath("/"); 
        return rows[0]; 
    } catch (error) {
        console.error("Error adding collection:", error);
        throw error;
    }
}