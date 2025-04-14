'use server';

import { auth } from "@/auth";
import { pool } from "@/lib/db";
import { toCamelCase } from "@/utils/caseConverter"; 

export default async function getUserInfo(userId: string) {
    const session = await auth();
    if (session?.user === null || session?.user === undefined) throw new Error("User not authenticated");

    try {
        const { rows } = await pool.query(
            `SELECT * FROM user_details WHERE user_id = $1`,
            [userId]
        );
        return toCamelCase(rows[0]); 
    } catch (error) {
        console.error("Error getting user info:", error);
        throw error;
    }
}