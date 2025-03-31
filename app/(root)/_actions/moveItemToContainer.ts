'use server'
import { auth } from "@/auth";
import { pool } from "@/lib/db";

export default async function moveItemToContainer(itemId: string, containerId: string) {
    const session = await auth();

    if (!session) {
        throw new Error("User not authenticated");
    }
    
    try {
        const { rows } = await pool.query(
            `UPDATE items SET "containerId" = $1 WHERE id = $2 RETURNING *`,
            [containerId, itemId]
        );
        return rows[0];
    } catch (error) {
        console.error("Error moving item to container:", error);
        throw error;
    }

}