'use server';

import { pool } from "@/lib/db";
import getItemTypeId from "@/app/(root)/_actions/getItemTypeId";

interface Item {
    type: string;
    name: string;
    description: string;
    quantity: number;
    itemType: string;
}

export default async function addItem(item: Item, collectionId: string, isDefault: boolean) {

    const itemTypeId = await getItemTypeId(item.itemType, isDefault);
    try {
        const { rows } = await pool.query(
            `INSERT INTO items ("collectionId", "typeId", name, description, quantity) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [collectionId, itemTypeId.id, item.name, item.description, item.quantity]
        );        
        
        return rows[0]; // Zwracamy nowo dodany obiekt
    } catch (error) {
        console.error("Error adding item:", error);
        throw error;
    }
}