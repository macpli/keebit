'use server'
import { auth } from "@/auth";
import { pool } from "@/lib/db";
import { ColorDTO } from "@/types/ColorDTO";

export default async function updateColor(color: ColorDTO) {
    const session = await auth();
    
    try {
        const { rows } = await pool.query(
            `UPDATE model_colors SET r = $1, g = $2, b = $3 WHERE user_id = $4 AND item_id = $5 AND material_index = $6 RETURNING *`,
            [color.r, color.g, color.b, session?.user?.id, color.item_id, color.material_index]
        );
        return rows[0];
    } catch (error) {
        console.error("Error updating color:", error);
        throw error;
    }
}