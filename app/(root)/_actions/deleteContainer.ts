'use server'
import { auth } from "@/auth";
import { pool } from "@/lib/db";

export default async function deleteContainer(containerId: string) {
    const session = await auth();

    if (!session) {
        throw new Error("User not authenticated");
    }

    try {
        await pool.query(
            `DELETE FROM containers WHERE "id" = $1`,
            [containerId]
        );
    } catch (error) {
        console.error("Error deleting container:", error);
        throw error;
    }
}