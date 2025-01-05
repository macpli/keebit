"use client";
import { Collection } from "@/types/collection";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

import { ChevronLeft } from "lucide-react"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default function CollectionPage() {
  const [collectionItems, setCollectionItems] = useState<Collection>();
  const [itemsWithoutContainers, setItemsWithoutContainers] = useState([]);
  const [containers, setContainers] = useState([]);
  
  const params = useParams<{ collectionId: string; }>();
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      const collectionData = await fetchCollectionContent(params.collectionId);
      if (collectionData) {
        getCollectionItems(collectionData);
        getContainers(collectionData);
      } else {
        console.error("Failed to fetch collection content");
      }
    };

    async function getCollectionItems(collection: any) {
      if(collection.itemsWithoutContainers === null) return;

      const items = collection.itemsWithoutContainers.map((item: any) => {
        return item;
      });
      setItemsWithoutContainers(items);
    }

    async function getContainers(collection: any) {
      if(collection.containers === null) return;

      const containers = collection.containers.map((container: any) => {
        return container;
      });
      setContainers(containers); console.log(containers);
    }

    fetchData();
  }, []);

  async function fetchCollectionContent(collectionId: string) {
    try {
      const res = await fetch(`${baseUrl}/api/collectionStructure/${collectionId}`, {
        cache: "no-store", // Avoid stale data
      });
      const data = await res.json();
      setCollectionItems(data.collection);
      return data.collection;
    } catch (error) {
      console.error("Failed to fetch collection content");
      return null; 
    }
  } 
  

  if (!params.collectionId) {
    return <div>Collection not found</div>;
  }

  return (


    <div className="p-6">
      
      <Button asChild variant="outline" size="icon" className="mb-4">

        <Link href="/">
          <ChevronLeft />
        </Link>
      </Button>

  
      <h1 className="text-2xl font-bold mb-2 ">{collectionItems?.name}</h1>
      <p className="text-gray-600">Created by: Maciej</p>

      <Separator className="mt-2 mb-6"/>

      <ResizablePanelGroup direction="horizontal" className="min-h-[200px] max-w rounded-lg border md:min-w-[450px]">
        <ResizablePanel defaultSize={65}>

          <div className="flex flex-col h-full p-6">
            <h2 className="text-xl font-semibold mb-4">Items</h2>
            {itemsWithoutContainers.map((item: any) => (
              <div key={item.itemId} className="bg-white p-2 rounded-md">
                <h3 className="font-semibold text-gray-800">{item.itemName}</h3>
                <p className="text-gray-600">{item.description}</p>
                <p className="text-gray-600">Quantity: {item.quantity}</p>
              </div>
            ))}
          </div>

        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={35}>
          <div className="flex flex-col h-full p-6">
            <h2 className="text-xl font-semibold mb-4">Containers</h2>
            {containers.map((container: any) => (
              <div key={container.containerId} className="bg-white p-4 rounded-md">
                <h3 className="font-semibold text-gray-800">{container.name}</h3>
                <div className="flex flex-col gap-2">
                  {container.items.map((item: any) => (
                    <div key={item.itemId} className="bg-white p-4 rounded-md">
                      <h3 className="font-semibold text-gray-800">{item.itemName}</h3>
                      <p className="text-gray-600">{item.description}</p>
                      <p className="text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>

      <div className="mt-8">
        <div className="flex gap-4 ">
          
          
          

        </div>
      </div>
    </div>
  );
}
