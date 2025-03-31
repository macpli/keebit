'use server';

import { pool } from "@/lib/db";
import { getItemTypeId } from "@/lib/utils";

interface Item {
    type: string;
    name: string;
    description: string;
    quantity: number;
    itemType: string;
}

export default async function addItem(item: Item, collectionId: string) {
    const itemTypeId = getItemTypeId(item.itemType);
    try {
        const { rows } = await pool.query(
            `INSERT INTO items ("collectionId", "typeId", name, description, quantity) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [collectionId, itemTypeId, item.name, item.description, item.quantity]
        );        
        
        return rows[0]; // Zwracamy nowo dodany obiekt
    } catch (error) {
        console.error("Error adding item:", error);
        throw error;
    }
}