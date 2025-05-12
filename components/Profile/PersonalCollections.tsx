import { Collection } from "@/types/collection";
import { CollectionCard } from "../CollectionCard";
import { Button, Tabs, TabsList, TabsContent, TabsTrigger } from "../ui";
import { PlusCircle } from "lucide-react";

interface PersonalCollectionsProps {
  collections: Collection[];
}

export default function PersonalCollections({
  collections,
}: PersonalCollectionsProps) {

    const publicCollections = collections.filter((collection) => collection.isPublic == true);
    const privateCollections = collections.filter((collection) => collection.isPublic == false);

  return (
    <>
      {/* All collections */}
      <div className="container px-4 mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">All Collections</h2>
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            New Collection
          </Button>
        </div>
        <Tabs defaultValue="all">
          <TabsList className="mb-6">
            <TabsTrigger value="all" className="gap-2">
              All
            </TabsTrigger>
            <TabsTrigger value="private" className="gap-2">
              Private
            </TabsTrigger>
            <TabsTrigger value="public" className="gap-2">
              Public
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {collections?.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {collections.map((collection: Collection) => (
                  <CollectionCard key={collection.id} collection={collection} />
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="private">
          {privateCollections?.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {privateCollections.map((collection: Collection) => (
                  <CollectionCard key={collection.id} collection={collection} />
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="public">
          {publicCollections?.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {publicCollections.map((collection: Collection) => (
                  <CollectionCard key={collection.id} collection={collection} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
