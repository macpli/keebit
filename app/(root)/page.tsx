import { auth } from "@/auth";
import { redirect } from "next/navigation";

import { Collection } from "../../types/collection";

import { CollectionCard } from '@/components/CollectionCard'
import { Button ,Tabs, TabsContent, TabsList, TabsTrigger,   Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger } from '@/components/ui/index'
import { TrendingUp, Keyboard, PlusCircle, Filter } from "lucide-react";
import CreateCollectionDialog from "@/components/CreateCollectionDialog";
import * as UIComponents from '@/components/ui/index';
import getPublicCollections from "./_actions/getPublicCollections";
import FeedCard from "@/components/FeedCard";

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

async function fetchPublicCollections() {
  const collections = await getPublicCollections();
  return collections;
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
  const publicCollections = await fetchPublicCollections();

  console.log(publicCollections);

  let dialogKey = Date.now();  

  return (
    <div className="container mx-auto p-4">

      {/* Tabs */}
      <Tabs defaultValue="collections">

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">

          {/* Tabs List */}
          <TabsList className="flex flex-wrap gap-2">
            <TabsTrigger value="collections" className="gap-2">
              <Keyboard className="h-4 w-4" />
              My Collections
            </TabsTrigger>
            <TabsTrigger value="feed" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Feed
            </TabsTrigger>
          </TabsList>

          {/* Buttons panel */}
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>

            <UIComponents.Dialog key={dialogKey}>
              <div>
                <DialogTrigger asChild>
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Collection
                  </Button>
                </DialogTrigger>
              </div>

              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add collection</DialogTitle>
                  <DialogDescription>
                    Create your collection here. Click submit when you're done.
                  </DialogDescription>
                </DialogHeader>

                <CreateCollectionDialog type={"add"} />
              </DialogContent>
            </UIComponents.Dialog>
          </div>

        </div>

        {/* Tabs Content */}
        <TabsContent value="collections">
          {/* Collection List - Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((collection: Collection) => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="feed">
          {/* Feed content can go here */}
          <div className="grid gap-6">
            {publicCollections.map((collection: Collection) => (
              <FeedCard key={collection.id} collection={collection}/>
            ))}
          </div>
        </TabsContent>

      </Tabs>

    </div>
  )
}