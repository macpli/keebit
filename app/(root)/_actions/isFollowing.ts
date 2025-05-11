'use server'
import { auth } from "@/auth";
import { pool } from "@/lib/db";

import { FollowData } from "@/types/followData";

export default async function isFollowing(followData: FollowData) {
    if(!followData || !followData.user_id || !followData.followed_id) {
        throw new Error("Invalid follow data");
    }

    try{
        const { rows } = await pool.query(
            `SELECT * FROM followers WHERE follower_id = $1 AND followed_id = $2`,
            [followData.user_id, followData.followed_id]
        );

        return rows[0] !== undefined;
    } catch (error) {
        console.error("Error checking follow:", error);
        throw error;
    }
}