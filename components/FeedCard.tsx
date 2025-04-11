"use client";
import React, { useEffect, useMemo } from "react";
import Image from "next/image";

import * as UI from "@/components/ui/index";
import {
  Badge,
  Pencil,
  Trash2,
  MoreVertical,
  Heart,
  MessageSquare,
  Bookmark,
} from "lucide-react";
import defaultUserImage from "../public/default-user-image.png";

import { PatternPlaceholder } from "./PatternPlaceholder";
import { Collection } from "@/types/collection";
import getCollectionDetails from "@/app/(root)/_actions/getCollectionDetails";
import { base64ToImage } from "@/lib/base64ToImage";

interface FeedCardProps {
  collection: Collection;
  variant?: "feed" | "profile";
}

export default function FeedCard({
  collection,
  variant = "feed",
}: FeedCardProps) {
  const [collectionDetails, setCollectionDetails] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const imageUrl = base64ToImage(collection.image);

  const memoizedCollectionDetails = useMemo(() => {
    return collectionDetails;
  }, [collectionDetails]);

  useEffect(() => {
    const fetchCollectionDetails = async () => {
      try {
        const details = await getCollectionDetails(
          collection.userId,
          collection.id
        );
        setCollectionDetails(details);
      } catch (error) {
        console.error("Error fetching collection details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollectionDetails();
  }, [collection.userId, collection.id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  console.log(memoizedCollectionDetails);

  return (
    <UI.Card key={collection.id} className="overflow-hidden">
      <UI.CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <UI.Avatar className="w-10">
              <UI.AvatarImage
                src={
                  memoizedCollectionDetails?.user_image
                    ? memoizedCollectionDetails.user_image
                    : defaultUserImage.src
                }
                alt={"profile picture"}
                width={40}
                height={40}
              />
              <UI.AvatarFallback>{""}</UI.AvatarFallback>
            </UI.Avatar>
            <div>
              <UI.CardTitle className="text-base">
                {collection.name}
              </UI.CardTitle>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <span>{memoizedCollectionDetails.username}</span>
                <span>•</span>
                <span>{collection.createdAt.toLocaleDateString()}</span>
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
          <UI.Badge variant="outline">Badge1</UI.Badge>
          <UI.Badge variant="outline">Badge2</UI.Badge>
          <UI.Badge variant="outline">Badge3</UI.Badge>
        </div>
      </UI.CardHeader>
      <UI.CardContent className="pb-3">
        <div className="h-64 bg-muted/20 rounded-md mb-4 overflow-hidden">
          {memoizedCollectionDetails.collection_image ? (
            <Image
              src={imageUrl}
              alt={collection.name}
              width={50}
              height={150}
              className="object-cover w-full h-full"
            />
          ) : (
            <PatternPlaceholder name={collection.name} />
          )}
        </div>

        {variant === "feed" && (
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium mb-2 font-semibold">
                Components
              </h4>
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
                  <span>Bauer Lite</span>
                  <UI.Badge variant="outline" className="text-xs">
                    Case
                  </UI.Badge>
                </li>
                <li className="text-sm flex justify-between">
                  <span>Cherry MX Red</span>
                  <UI.Badge variant="outline" className="text-xs">
                    Switch
                  </UI.Badge>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2 font-semibold">
                Accessories
              </h4>
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
                  <span>HHKB Hybrid Type-S</span>
                  <UI.Badge variant="outline" className="text-xs">
                    keyboard
                  </UI.Badge>
                </li>
              </ul>
            </div>
          </div>
        )}
      </UI.CardContent>
      <UI.CardFooter className="border-t pt-3 flex justify-between">
        <div className="flex items-center gap-4">
          <UI.Button
            variant="ghost"
            size="sm"
            className="gap-1 text-muted-foreground"
            //   onClick={() => handleLikeCollection(collection.id)}
          >
            <Heart className="h-4 w-4" />1{/* {collection.likes} */}
          </UI.Button>
          <UI.Button
            variant="ghost"
            size="sm"
            className="gap-1 text-muted-foreground"
          >
            <MessageSquare className="h-4 w-4" />1{/* {collection.comments} */}
          </UI.Button>
          <UI.Button
            variant="ghost"
            size="sm"
            className="gap-1 text-muted-foreground"
          >
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
  );
}
