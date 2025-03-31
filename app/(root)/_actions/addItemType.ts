'use server';

import { auth } from "@/auth";
import { pool } from "@/lib/db";

interface ItemType {
    name: string;
    description: string;
}

export default async function addItemType(itemType: ItemType){
    const session = await auth();
    if(session?.user === null || session?.user === undefined) throw new Error("User not authenticated");

    try {
        const { rows } = await pool.query(
            `INSERT INTO item_types ("userId", name, description) VALUES ($1, $2, $3) RETURNING *`,
            [session.user.id, itemType.name, itemType.description]
        );
        return rows[0];
    } catch (error) {
        console.error("Error adding item type:", error);
        throw error;
    }
}