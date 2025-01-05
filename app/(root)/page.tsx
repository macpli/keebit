import { auth } from "@/auth";
import { Collection } from "../../types/collection";
import Link from 'next/link';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

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

export default async function UsersPage() {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
        return <div>Please log in to view your collections.</div>;
  }  

  const collections = await fetchCollections(session.user.id);  

  return (
    <div>
      {collections.map((collection: Collection) => (

        <Link key={collection.id} href={`/collections/${collection.id}`} className="block p-4 hover:bg-gray-50">
          <h2>{collection.name}</h2>
        </Link>
        
      ))}

    </div>
  )
}