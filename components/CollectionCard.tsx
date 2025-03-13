import { Separator, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/index"
import { ChevronRight, FolderIcon, CuboidIcon as Cube3d, PlusCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Collection } from "@/types/collection"
import { PatternPlaceholder } from "./PatternPlaceholder"

function base64ToImage(base64: string): string {
  return `data:image/png;base64,${base64}`;
}

export function CollectionCard({collection}: {collection: Collection}) {
    const imageUrl = base64ToImage(collection.image)
    return(
        <Card key={collection.id} className="overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <FolderIcon className="h-5 w-5" />
            {collection.name}
          </CardTitle>
          <CardDescription>{collection.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-40 bg-muted/20 rounded-md mb-4 overflow-hidden">
            
            <div className="w-full h-full flex items-center justify-center">

                {imageUrl === "data:image/png;base64,null" ? (
                    PatternPlaceholder({name: collection.name})
                    ) : (
                      <Image
                      src={imageUrl}
                      alt={`${collection.name} preview`}
                      width={150}
                      height={150}
                      className="object-contain"
                  />
                    )}
            </div>
            
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">100 items</div>
            <Button
              disabled
                asChild
              variant="ghost"
              size="sm"
              className="text-primary"
            >
                <Link key={collection.id} href={`/collections/${collection.id}`}>
                    Show Preview
                </Link>
            </Button>
          </div>
          <Separator className="my-4" />
          <div className="flex items-center justify-between">
         
          <Button
                asChild
              variant="outline"
              size="sm"
              className="text-primary"
            >
                <Link key={collection.id} href={`/collections/${collection.id}`}>
                    Show Collection
                </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
}