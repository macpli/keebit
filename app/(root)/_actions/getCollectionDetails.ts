'use server'
import { pool } from "@/lib/db";
import { auth } from "@/auth";

export default async function getCollectionDetails(userId: string, collectionId: string){
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
      throw new Error("User not authenticated");

    }

    try {
        const { rows } = await pool.query(
            `SELECT 
            collections.id AS collection_id,
            collections.name AS collection_name,
            collections.description AS collection_description,
            collections.image AS collection_image,
            users.name AS user_name,
            users.username AS user_username,
            users.id AS user_id,
            users.image AS user_image,
            *,
            user_details.*
            FROM 
            collections 
            JOIN users ON collections."userId" = users.id
            JOIN user_details ON users.id = user_details.user_id
            WHERE collections."userId" = $1 AND collections.id = $2`,
            [userId, collectionId]    );
    
        return rows[0];
      } catch (error) {
        console.error("Error getting colors:", error);
        throw error;
      }
}