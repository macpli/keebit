// import { pool } from "@/app/lib/db"; 

// export async function getUserCollections(userId: string) {
//     try {
//       const { rows } = await pool.query(
//         `SELECT * FROM collections WHERE "userId" = $1`,
//         [userId]
//       );
//       return rows;
//     } catch (error) {
//       console.error("Error fetching user collections:", error);
//       throw new Error("Could not fetch user collections");
//     }
// }

// export async function getCollectionStructure(collectionId: string) {
//     try {
//       const { rows } = await pool.query(
//        `SELECT json_build_object(
//     'collectionId', c."id",
//     'name', c."name",
//     'containers', (
//         SELECT json_agg(
//             json_build_object(
//                 'containerId', co."id",
//                 'name', co."name",
//                 'items', (
//                     SELECT json_agg(
//                         json_build_object(
//                             'itemId', i."id",
//                             'itemName', i."name",
//                             'description', i."description",
//                             'quantity', i."quantity",
//                             'attributes', i."attributes"
//                         )
//                     )
//                     FROM "items" i
//                     WHERE i."containerId" = co."id" AND i."collectionId" = c."id"
//                 )
//             )
//         )
//         FROM "containers" co
//         WHERE co."id" IN (
//             SELECT DISTINCT "containerId"
//             FROM "items"
//             WHERE "collectionId" = c."id"
//         )
//     ),
//     'itemsWithoutContainers', (
//         SELECT json_agg(
//             json_build_object(
//                 'itemId', i."id",
//                 'itemName', i."name",
//                 'description', i."description",
//                 'quantity', i."quantity",
//                 'attributes', i."attributes"
//             )
//         )
//         FROM "items" i
//         WHERE i."containerId" IS NULL AND i."collectionId" = c."id"
//     )
// ) AS "collectionData"
// FROM "collections" c
// WHERE c."id" = $1;`,
//         [collectionId]
//       );
//       return rows[0]?.collectiondata || null;
//     } catch (error) {
//       console.error("Error fetching collection structure:", error);
//       throw new Error("Could not fetch collection structure");
//     }
//   }
  