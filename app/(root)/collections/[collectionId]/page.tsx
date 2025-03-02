"use client";
import { Collection } from "@/types/collection";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import addItem  from "../../_actions/addItem";
import { revalidatePath } from "next/cache";

import { ChevronLeft, ChevronsUpDown, Check } from "lucide-react"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import AddItemForm from '@/components/AddItemForm'
import ItemView from "@/components/ItemView/ItemView";
import { Item } from "@/types/item";
import { set } from "react-hook-form";


export default function CollectionPage() {
  const [collectionItems, setCollectionItems] = useState<Collection>();
  const [itemsWithoutContainers, setItemsWithoutContainers] = useState([]);
  const [containers, setContainers] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isItemViewOpen, setIsItemViewOpen] = useState(false);
  const [itemToDisplay, setItemToDisplay] = useState<Item>();

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

    fetchData();
  }, []);

  async function getCollectionItems(collection: any) {
    if(collection.itemsWithoutContainers === null) return;

    const items = collection.itemsWithoutContainers.map((item: Item) => {
      return item;
    });
    setItemsWithoutContainers(items);
    console.log(items);
  }

  async function getContainers(collection: any) {
    if(collection.containers === null) return;

    const containers = collection.containers.map((container: any) => {
      return container;
    });
    setContainers(containers); 
  }

  async function fetchCollectionContent(collectionId: string) {
    try {
      const res = await fetch(`${baseUrl}/api/collectionStructure/${collectionId}`, {
        cache: "no-store", // Avoid stale data
      });
      const data = await res.json(); console.log(data)
      setCollectionItems(data.collection);
      return data.collection;
    } catch (error) {
      console.error("Failed to fetch collection content");
      return null; 
    }
  } 

  const handleFormSuccess = () => {
    setIsDialogOpen(false);
  };

  const toggleItemView = (e: Item) => {
    if(e === itemToDisplay) {
      setIsItemViewOpen(!isItemViewOpen);
      setItemToDisplay(undefined);
      return;
    } else {
      setItemToDisplay(e);
      setIsItemViewOpen(true);
    }
  };
  
  if (!params.collectionId) {
    return <div>Collection not found</div>;
  }

  return (
    <div className="p-6">
      
      <h1 className="text-2xl font-bold mb-2 ">{collectionItems?.name}</h1>
      <p className="text-gray-600">{collectionItems?.description}</p>

      <Separator className="mt-2 mb-6"/>

      <div className="flex gap-4">

        <Button asChild variant="outline" size="icon" className="mb-4">
          <Link href="/">
            <ChevronLeft />
          </Link>
        </Button>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <div className=''>
            <DialogTrigger asChild >
              <Button variant="outline" onClick={() => setIsDialogOpen(true)}>New</Button>
            </DialogTrigger>
          </div>

          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add new</DialogTitle>
              <DialogDescription>
                Create your container here or add an item. Click save when you're done.
              </DialogDescription>
            </DialogHeader>

            <AddItemForm collectionId={params.collectionId} onSuccess={handleFormSuccess}/>

          </DialogContent>
        </Dialog>

      </div>
      
      <Separator className="mt-2 mb-6"/>

      <ItemView item={itemToDisplay}/>

      <ResizablePanelGroup direction="horizontal" className="min-h-[200px] max-w rounded-lg border md:min-w-[450px] mt-4">
        <ResizablePanel defaultSize={65}>

          <div className="flex flex-col h-full p-6 space-y-2">
            <h2 className="text-xl font-semibold mb-4">Items</h2>

            {/* ITEMS LIST  */}
            {itemsWithoutContainers.map((item: Item) => (
              <div key={item.itemId}
                    onClick={() => toggleItemView(item)}  
                    className={`
                    p-2 rounded-md cursor-pointer transition-colors ${itemToDisplay?.itemId === item.itemId ? 'bg-primary text-primary-foreground' : 'bg-card hover:bg-muted'}
                    `}>
                <h3 className="font-medium ">{item.itemName}</h3>
                <p className={`text-sm ${itemToDisplay?.itemId === item.itemId ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{item.description}</p>
                <p className={`text-sm ${itemToDisplay?.itemId === item.itemId ? "text-primary-foreground/80" : "text-muted-foreground"}`}>Quantity: {item.quantity}</p>
              </div>
            ))}

          </div>

        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={35}>
          <div className="flex flex-col h-full p-6">
            <h2 className="text-xl font-semibold mb-4">Containers</h2>

            {/* CONTAINERS LIST  */}
            {containers.map((container: any) => (
              <div key={container.containerId} className="bg-white p-4 rounded-md">
                <h3 className="font-semibold text-gray-800">{container.name}</h3>
                <div className="flex flex-col gap-2">
                  {container.items.map((item: any) => (
                    <div key={item.itemId} className="bg-white p-4 rounded-md">
                      <h3 className="text-medium text-gray-800">{item.itemName}</h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}

          </div>
        </ResizablePanel>
      </ResizablePanelGroup>

    </div>
  );
}
