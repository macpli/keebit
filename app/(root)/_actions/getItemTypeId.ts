'use server';

import { auth } from "@/auth";
import { pool } from "@/lib/db";

export default async function getItemTypeId(itemTypeName: string, isDefault: boolean) {
    const session = await auth();

    if (session == null || session.user == null || session.user.id == null) {
        throw new Error("Unauthorized");
    }

    var userId: string | null = session.user.id;

    if(isDefault){
        const { rows } = await pool.query(
            `SELECT id FROM item_types WHERE name = $1 AND is_default = true`,
            [itemTypeName]
        );

        return rows[0];
    } else {
        
        const { rows } = await pool.query(
            `SELECT id FROM item_types WHERE name = $1 AND "userId" = $2`,
            [itemTypeName, userId]
        );
        console.log("ITEM TYPE name: ", itemTypeName);
        return rows[0];
    }

}