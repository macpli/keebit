import React from 'react'

import * as UI from '@/components/ui/index'
import { Badge,  Pencil, Trash2, MoreVertical, Heart, MessageSquare, Bookmark  } from 'lucide-react'
import { PatternPlaceholder } from './PatternPlaceholder'
import { Collection } from '@/types/collection'

interface FeedCardProps {
    collection: Collection;
  }
  
  export default function FeedCard({ collection }: FeedCardProps) {
    console.log(collection)
  return (
      <UI.Card key={collection.id} className="overflow-hidden">
        <UI.CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <UI.Avatar>
                <UI.AvatarImage src={ ''} alt={''} />
                <UI.AvatarFallback>{''}</UI.AvatarFallback>
              </UI.Avatar>
              <div>
                <UI.CardTitle className="text-base">{collection.name}</UI.CardTitle>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <span>
                    CreatedByPlaceholder
                    {/* {collection.createdBy.username} */}
                    </span>
                  <span>•</span>
                  {/* <span>{collection.createdAt}</span> */}
                </div>
              </div>
            </div>

            {/* {collection.createdBy.id ===  && (
              <UI.DropdownMenu>
                <UI.DropdownMenuTrigger asChild>
                  <UI.Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </UI.Button>
                </UI.DropdownMenuTrigger>
                <UI.DropdownMenuContent align="end">

                  <UI.DropdownMenuSeparator />
                  
                </UI.DropdownMenuContent>
              </UI.DropdownMenu>
            )} */}
          </div>
          <UI.CardDescription>{collection.description}</UI.CardDescription>
          <div className="flex flex-wrap gap-2 mt-2">
            {/* {collection.tags.map((tag: string, i: number) => (
              <Badge key={i} >
                {tag}
              </Badge>
            ))} */}
            <Badge>Badge1</Badge>
            <Badge>Badge2</Badge>
            <Badge>Badge3</Badge>
          </div>
        </UI.CardHeader>
        <UI.CardContent className="pb-3">
          <div className="h-64 bg-muted/20 rounded-md mb-4 overflow-hidden">
              <PatternPlaceholder name={collection.name} />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Components</h4>
              <ul className="space-y-1">
                {/* {collection.leftListItems.map((item: any) => (
                  <li key={item.id} className="text-sm flex justify-between">
                    <span>{item.name}</span>
                    <Badge  className="text-xs">
                      {item.type}
                    </Badge>
                  </li>
                ))} */}
                <li className="text-sm flex justify-between">
                  <span>Item1</span>
                  <Badge  className="text-xs">
                    Type1
                  </Badge>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">Accessories</h4>
              <ul className="space-y-1">
                {/* {collection.rightListItems.map((item: any) => (
                  <li key={item.id} className="text-sm flex justify-between">
                    <span>{item.name}</span>
                    <Badge  className="text-xs">
                      {item.type}
                    </Badge>
                  </li>
                ))} */}
                <li className="text-sm flex justify-between">
                  <span>Item2</span>
                  <Badge  className="text-xs">
                    Type2
                  </Badge>
                </li>
              </ul>
            </div>
          </div>
        </UI.CardContent>
        <UI.CardFooter className="border-t pt-3 flex justify-between">
          <div className="flex items-center gap-4">
            <UI.Button
              variant="ghost"
              size="sm"
              className="gap-1 text-muted-foreground"
            //   onClick={() => handleLikeCollection(collection.id)}
            >
              <Heart className="h-4 w-4" />
              {/* {collection.likes} */}
            </UI.Button>
            <UI.Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
              <MessageSquare className="h-4 w-4" />
              {/* {collection.comments} */}
              CommentsPlaceholder
            </UI.Button>
            <UI.Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
              <Bookmark className="h-4 w-4" />
            </UI.Button>
          </div>
          <UI.Button
            variant="outline"
            size="sm"
            // onClick={() =>('')
            //   setSelectedCollection(selectedCollection === collection.id ? null : collection.id)
            // }
          >
            Show Preview
            {/* {selectedCollection === collection.id ? "Hide Preview" : "Show Preview"} */}
          </UI.Button>
        </UI.CardFooter>
      </UI.Card>
  )
}
