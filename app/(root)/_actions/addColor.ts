'use server'
import { auth } from "@/auth";
import { pool } from "@/lib/db";
import { ColorDTO } from "@/types/ColorDTO";

export default async function addColor(color: ColorDTO) {
    const session = await auth();
    
    try {
        const { rows } = await pool.query(
            `INSERT INTO model_colors (model_name, item_id, user_id, r, g, b, material_index) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [color.model_name, color.item_id, session?.user?.id, color.r, color.g, color.b, color.material_index]
        );
        return rows[0];
    } catch (error) {
        console.error("Error adding color:", error);
        throw error;
    }
}