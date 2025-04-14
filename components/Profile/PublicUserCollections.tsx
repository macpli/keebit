
import { Collection } from "@/types/collection";
import { Button } from "../ui";
import { PlusCircle } from "lucide-react";
import FeedCard from "../FeedCard";

interface PublicUserCollections {
    collections: Collection[];
  }

export default  function PublicUserCollections({ collections }: PublicUserCollections) {
  return (
    <>
      {/* All collections */}
      <div className="container px-4 mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Public Collections</h2>
        </div>

        {collections?.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((collection: Collection) => (
              <FeedCard key={collection.id} collection={collection} variant="profile"/>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
