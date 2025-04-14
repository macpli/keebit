'use server'
import { pool } from "@/lib/db";
import { auth } from "@/auth";

export default async function getDefaultItemTypes(){
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        throw new Error("User not authenticated");
    }

    try {
        const { rows } = await pool.query(
            `SELECT * FROM item_types WHERE is_default = true ORDER BY name`,
        );
    
        return rows;
      } catch (error) {
        console.error("Error getting colors:", error);
        throw error;
      }
}