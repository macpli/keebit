import { auth } from "@/auth";
import { User } from "../types/user";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

// async function fetchCollection(collectionId: string) {
  
//   const res = await fetch(baseUrl+`/api/collections/${collectionId}`);
//   const data = await res.json();
//   return data.collection;
// }

async function fetchCollections(userId: string) {
  const res = await fetch(baseUrl+'/api/collections/' + userId, {
    cache: "no-store", // Avoid stale data
  });

  if (!res.ok) {
    console.error("Failed to fetch collections");
    return [];
  }

  const data = await res.json();
  return data.collection;
}


export default async function UsersPage({ params }: { params: { collectionId: string } }) {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
        return <div>Please log in to view your collections.</div>;
  }  

  const collections = await fetchCollections(session.user.id);  
  console.log(collections)


  return (
    <div>
      Hello World!
    </div>
  )
}