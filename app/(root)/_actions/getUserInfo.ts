'use server';
import { pool } from "@/lib/db";

export default async function getUserInfo(userId: string){
    
      try {
        const { rows } = await pool.query(
          `SELECT * FROM users WHERE id = $1`,
          [ userId ]
        );
    
        return rows[0]; 
      } catch (error) {
        console.error("Error adding collection:", error);
        throw error;
      }
}