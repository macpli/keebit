'use server';
import { pool } from "@/lib/db";

export default async function getPublicCollections() {
    try {
      const { rows } = await pool.query(
        `SELECT * FROM collections WHERE is_public = true`,
      );

      return rows; 
    } catch (error) {
      console.error("Error adding collection:", error);
      throw error;
    }
}