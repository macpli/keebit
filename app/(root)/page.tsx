import { auth } from "@/auth";
import Link from 'next/link';
import { redirect } from "next/navigation";

import { revalidatePath } from "next/cache";
import { addCollection } from "./_actions/addCollection";
import { deleteCollection } from "./_actions/deleteCollection";

import { Collection } from "../../types/collection";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input"
import { Ellipsis } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CollectionCard } from '@/components/CollectionCard'

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

let dialogKey = Date.now();



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
      {/* Add Collection button with dialog window */}
      
      {/* Collection List - Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

      {collections.map((collection: Collection) => (

        <CollectionCard key={collection.id} collection={collection} />
        // Fix Link to a different element, probably make a client component with this list
        // <Link key={collection.id} href={`/collections/${collection.id}`} className="block p-4 hover:bg-gray-50">
        //   <div className="flex justify-between">
        //     <h2>{collection.name}</h2>
            
        //     <div className="mx-9">
        //     <DropdownMenu>
        //     <DropdownMenuTrigger asChild>
        //       <Button variant="ghost"><Ellipsis /></Button>
        //     </DropdownMenuTrigger>
            
        //     <DropdownMenuContent>

        //       <DropdownMenuItem disabled>
        //         <form
        //           action={async () => {
        //             "use server";
        //           }}
        //         >
        //           <button type='submit'>Edit</button>
        //         </form>
        //       </DropdownMenuItem>

        //       <DropdownMenuItem>
        //         <form action={async () => {
        //           "use server";
        //           await deleteCollection({ collectionId: collection.id })
        //           }}>
        //           <button type='submit'>Delete</button>
        //         </form>
        //       </DropdownMenuItem>

        //     </DropdownMenuContent>

        //   </DropdownMenu>
        //     </div>
            
        //   </div>
        // </Link>
        
      ))}
      </div>

    </div>
  )
}