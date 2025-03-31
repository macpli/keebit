import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

// Fetch all contents for a specific collection
export async function GET(req: NextRequest, {
  params,
}: {
  params: Promise<{ collectionId: string }>
}) {

  const collectionId = (await params).collectionId;

  if (!collectionId) {
    return NextResponse.json(
      { error: "Collection ID is required" },
      { status: 400 }
    );
  }

  try {
    const { rows } = await pool.query(
      `
      SELECT json_build_object(
    'collectionId', c."id",
    'name', c."name",
    'description', c."description",
    'containers', (
        SELECT json_agg(
            json_build_object(
                'containerId', co."id",
                'name', co."name",
                'items', (
                    SELECT json_agg(
                        json_build_object(
                            'itemId', i."id",
                            'itemName', i."name",
                            'description', i."description",
                            'quantity', i."quantity",
                            'attributes', i."attributes",
                            'itemType', it."name"
                        )
                    )
                    FROM "items" i
                    JOIN "item_types" it ON i."typeId" = it."id"
                    WHERE i."containerId" = co."id"
                )
            )
        )
        FROM "containers" co
        WHERE co."collectionId" = c."id"
    ),
    'itemsWithoutContainers', (
    SELECT json_agg(
        json_build_object(
            'itemId', i."id",
            'itemName', i."name",
            'description', i."description",
            'quantity', i."quantity",
            'attributes', i."attributes",
            'itemType', it."name" 
        )
    )
    FROM "items" i
    JOIN "item_types" it ON i."typeId" = it."id"
    WHERE i."containerId" IS NULL AND i."collectionId" = c."id"
)
) AS "collectionData"
FROM "collections" c
WHERE c."id" = $1;`,
      [collectionId]
    );

    const collection = rows[0]?.collectionData;

    if (!collection) {
      return NextResponse.json(
        { error: "Collection not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ collection });
  } catch (error) {
    console.error("Database query failed", error);
    return NextResponse.json(
      { error: "Failed to fetch collection data" },
      { status: 500 }
    );
  }
}
