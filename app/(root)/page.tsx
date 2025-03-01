import { auth } from "@/auth";
import { Collection } from "../../types/collection";
import Link from 'next/link';
import { revalidatePath } from "next/cache";
import { addCollection } from "./_actions/addCollection";
import { deleteCollection } from "./_actions/deleteCollection";


import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Ellipsis } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { redirect } from "next/navigation";


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

async function handleSubmit(formData: FormData) {
  'use server';

  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    console.error("Failed to create collection");
    return;
  }

  const name = formData.get('name') as string;
  const description = formData.get('description') as string;

  if (!name || !description) {
    throw new Error("Name and description are required");
  }

  await addCollection({ name, description, userId: session.user.id });

  revalidatePath('/collections');
  dialogKey = Date.now();
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
    <div>
      <Dialog key={dialogKey} >
        <div className='px-3 pt-2'>
      <DialogTrigger asChild >
        <Button variant="outline">Add Collection</Button>
      </DialogTrigger>

        </div>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add collection</DialogTitle>
          <DialogDescription>
            Create your collection here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" name="name"  className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input id="description" name="description" className="col-span-3" / >
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {collections.map((collection: Collection) => (

        // Fix Link to a different element, probably make a client component with this list
        <Link key={collection.id} href={`/collections/${collection.id}`} className="block p-4 hover:bg-gray-50">
          <div className="flex justify-between">
            <h2>{collection.name}</h2>
            
            <div className="mx-9">
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost"><Ellipsis /></Button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent>

              <DropdownMenuItem disabled>
                <form
                  action={async () => {
                    "use server";
                  }}
                >
                  <button type='submit'>Edit</button>
                </form>
              </DropdownMenuItem>

              <DropdownMenuItem>
                <form action={async () => {
                  "use server";
                  await deleteCollection({ collectionId: collection.id })
                  }}>
                  <button type='submit'>Delete</button>
                </form>
              </DropdownMenuItem>

            </DropdownMenuContent>

          </DropdownMenu>
            </div>
            
          </div>
        </Link>
        
      ))}

    </div>
  )
}