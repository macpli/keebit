'use server';

import { pool } from "@/lib/db";
import { toCamelCase } from "@/utils/caseConverter"; 

export default async function getUserDetails(userId: string) {
    if (!userId) {
        throw new Error("Invalid user ID");
    }

    try {
        const { rows } = await pool.query(
            `SELECT * FROM user_details WHERE user_id = $1`,
            [userId]
        );
        const response = toCamelCase(rows[0]);
        return response;
    } catch (error) {
        console.error("Error getting user info:", error);
        throw error;
    }
}