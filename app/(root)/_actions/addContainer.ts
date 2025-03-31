'use server'
import { auth } from "@/auth";
import { pool } from "@/lib/db";
import { Collection } from "@/types/collection";

export default async function addContainer(name: string, description: string, collectionId: string) {
    const session = await auth();

    if (!session) {
        throw new Error("User not authenticated");
    }
    
    try {
        const { rows } = await pool.query(
            `INSERT INTO containers (name, description, "collectionId") VALUES ($1, $2, $3) RETURNING *`,
            [name, description, collectionId]
        );
        return rows[0] as Collection;
    } catch (error) {
        console.error("Error adding container:", error);
        throw error;
    }
}