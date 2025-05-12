'use server';

import { pool } from "@/lib/db";
import getItemTypeId from "@/app/(root)/_actions/getItemTypeId";

interface Item {
    name: string;
    description: string;
    quantity: number;
    itemType: string;
    additionalData: any;
}

export default async function addItem(item: Item, collectionId: string, isDefault: boolean) {
    
    const itemTypeId = await getItemTypeId(item.itemType, isDefault);
    console.log("Collection ID: ", collectionId);
    try {
        const { rows } = await pool.query(
            `INSERT INTO items ("collectionId", "typeId", name, description, quantity, additional_data) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [collectionId, itemTypeId.id, item.name, item.description, item.quantity, item.additionalData]
        );        
        
        return rows[0]; 
    } catch (error) {
        console.error("Error adding item:", error);
        throw error;
    }
}