'use server';

import { auth } from "@/auth";
import { pool } from "@/lib/db";
import { getItemTypeId } from "@/lib/utils";

import { Item } from "@/types/item";

export async function editItem(item: Item, itemId: string) {
    const session = await auth()
    const itemTypeId = getItemTypeId(item.itemType);
    console.log(item.itemType);

    if (!session || !session.user || !session.user.id) {
      console.error("Failed to create collection");
      return;
    }

    try {
        const { rows } = await pool.query(
            `UPDATE items SET name = $1, "typeId" = $2,description = $3, quantity = $4, image = $5 WHERE id = $6 RETURNING *`,
            [item.itemName, itemTypeId, item.description, item.quantity, item.image, itemId]
          );
    
        return rows[0]; 
      } catch (error) {
        console.error("Error adding collection:", error);
        throw error;
      }
}