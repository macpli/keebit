'use server'
import { auth } from "@/auth";
import { pool } from "@/lib/db";

import { FollowData } from "@/types/followData";


export default async function addFollow(followData: FollowData) {
    if(!followData || !followData.user_id || !followData.followed_id) {
        throw new Error("Invalid follow data");
    }

    try{
        const { rows } = await pool.query(
            `INSERT INTO followers (follower_id, followed_id) VALUES ($1, $2) RETURNING *`,
            [followData.user_id, followData.followed_id]
        );
        return rows[0];
    } catch (error) {
        console.error("Error adding follow:", error);
        throw error;
    }

}