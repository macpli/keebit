import { auth } from "@/auth";
import { redirect } from "next/navigation";

import { Collection } from "../../types/collection";

import { CollectionCard } from '@/components/CollectionCard'

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

async function fetchCollections(userId: string) {
  const res = await fetch(baseUrl+'/api/collections/' + userId, {
    cache: "no-store", 
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
  if(!session) {
    redirect("/login");
  }

  if (!session || !session.user || !session.user.id) {
        return <div>Please log in to view your collections.</div>;
  }  

  const collections = await fetchCollections(session.user.id);  

  return (
    <div className="container mx-auto p-4">
      
      {/* Collection List - Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {collections.map((collection: Collection) => (
          <CollectionCard key={collection.id} collection={collection} />
        ))}
      </div>

    </div>
  )
}