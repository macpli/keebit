'use server';

import { auth } from "@/auth";
import { pool } from "@/lib/db";

interface ItemType {
    name: string;
    description: string;
}

export default async function addItemType(){
    const session = await auth();
    if(session?.user === null || session?.user === undefined) throw new Error("User not authenticated");

    try {
        const { rows } = await pool.query(
            `SELECT name FROM item_types WHERE "userId" = $1`,
            [session.user.id]
        );
        return rows;
    } catch (error) {
        console.error("Error adding item type:", error);
        throw error;
    }
}