'use server';

import { auth } from "@/auth";
import { pool } from "@/lib/db";

export default async function getItemTypeId(itemTypeName: string) {
    const session = await auth();

    if (session == null || session.user == null || session.user.id == null) {
        throw new Error("Unauthorized");
    }

    const { rows } = await pool.query(
        `SELECT id FROM item_types WHERE name = $1 AND "userId" = $2`,
        [itemTypeName, session.user.id]
    );

  return rows[0];
}