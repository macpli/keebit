"use client";
import { Collection } from "@/types/collection";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

import { Item } from "@/types/item";

import { Button, Separator, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, ScrollArea, ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/index";
import { ChevronLeft, Share,  PackageOpen as ContainerIcon, Component } from "lucide-react"

import { publishCollection } from "../../_actions/publishCollection";
import AddItemForm from '@/components/AddItemForm'
import ItemView from "@/components/ItemView/ItemView";


export default function CollectionPage() {
  const [collectionItems, setCollectionItems] = useState<Collection>();
  const [itemsWithoutContainers, setItemsWithoutContainers] = useState([]);
  const [containers, setContainers] = useState([]);
  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);
  const [isCreateNewCollectionDialogOpen, setIsCreateNewCollectionDialogOpen] = useState(false);
  const [isItemViewOpen, setIsItemViewOpen] = useState(false);
  const [itemToDisplay, setItemToDisplay] = useState<Item>();

  const params = useParams<{ collectionId: string; }>();
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    fetchData();
  }, []);

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

    const items = collection.itemsWithoutContainers.map((item: Item) => {
      return item;
    });
    setItemsWithoutContainers(items);
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
      const data = await res.json();
      setCollectionItems(data.collection);
      return data.collection;
    } catch (error) {
      console.error("Failed to fetch collection content");
      return null; 
    }
  } 

  const handleFormSuccess = async () => {
    setIsCreateNewCollectionDialogOpen(false);
    await fetchData();
  };

  const handlePublish = async () => {
    await publishCollection(params.collectionId);
    setIsPublishDialogOpen(false);
  }

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

        {/* Create new collection dialog */}
        <Dialog open={isCreateNewCollectionDialogOpen} onOpenChange={setIsCreateNewCollectionDialogOpen}>
          <div className=''>
            <DialogTrigger asChild >
              <Button variant="outline" onClick={() => setIsCreateNewCollectionDialogOpen(true)}>New</Button>
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

        <Dialog open={isPublishDialogOpen} onOpenChange={setIsPublishDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Share className="h-5 w-5 mr-1" />
              Publish
              </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Publish</DialogTitle>
              <DialogDescription>
                Are you sure you want to publish this collection?
              </DialogDescription>
            </DialogHeader>

            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => setIsPublishDialogOpen(false)}>Cancel</Button>
              <Button onClick={handlePublish}>Publish</Button>
            </div>

          </DialogContent>
        </Dialog>

      </div>
      

      <ItemView item={itemToDisplay}/>

      <ResizablePanelGroup direction="horizontal" className="min-h-[200px] max-w rounded-lg border md:min-w-[450px] mt-4">
        <ResizablePanel defaultSize={50}>

          <div className="flex flex-col h-full">

            <div className="flex gap-2 items-center p-4 mb-4 border-b">
              <Component className="h-5 w-5" />
              <h2 className="text-xl font-semibold">Items</h2>
            </div>

            {/* ITEMS LIST  */}
            <ScrollArea className="flex-1 h-75">
              <div className="p-4 space-y-2">
                {itemsWithoutContainers.map((item: Item) => (
                  <div key={item.itemId}
                        onClick={() => toggleItemView(item)}  
                        className={`
                        p-3 rounded-md cursor-pointer transition-colors ${itemToDisplay?.itemId === item.itemId ? 'bg-primary text-primary-foreground' : 'bg-card hover:bg-muted'}
                        `}>
                    <h3 className="font-medium ">{item.itemName}</h3>
                    <p className={`text-sm ${itemToDisplay?.itemId === item.itemId ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{item.description}</p>
                    <p className={`text-sm ${itemToDisplay?.itemId === item.itemId ? "text-primary-foreground/80" : "text-muted-foreground"}`}>Quantity: {item.quantity}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
            

          </div>

        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={50}>
          <div className="flex flex-col h-full">
            
            <div className="flex p-4 mb-4 border-b items-center gap-2"> 
            <ContainerIcon className="h-5 w-5" / >
              <h2 className="text-xl font-semibold">Containers</h2>
            </div>

            {/* CONTAINERS LIST  */}
            <ScrollArea className="flex-1">
            <div className="p-4 space-y-2">

              {containers.map((container: any) => (
                <div key={container.containerId} className="bg-white p-4 rounded-md">
                  <h3 className="font-medium">{container.name}</h3>
                  <div className="flex flex-col gap-2">
                    {container.items.map((item: any) => (
                      <div key={item.itemId} onClick={() => toggleItemView(item)} className={`
                        p-3 rounded-md cursor-pointer transition-colors ${itemToDisplay?.itemId === item.itemId ? 'bg-primary text-primary-foreground' : 'bg-card hover:bg-muted'}
                        `}>
                        <h3 className="text-medium">{item.itemName}</h3>
                        <p className={`text-sm ${itemToDisplay?.itemId === item.itemId ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{item.description}</p>
                        <p className={`text-sm ${itemToDisplay?.itemId === item.itemId ? "text-primary-foreground/80" : "text-muted-foreground"}`}>Quantity: {item.quantity}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            </ScrollArea>


          </div>
        </ResizablePanel>
      </ResizablePanelGroup>

    </div>
  );
}
