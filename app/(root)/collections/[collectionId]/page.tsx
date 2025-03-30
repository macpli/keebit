"use client";
import { Collection } from "@/types/collection";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

import { Item } from "@/types/item";

import * as UI from "@/components/ui/index";

import {
  Settings,
  MoreVertical,
  Trash2,
  Pencil,
  ChevronLeft,
  Share,
  PackageOpen as ContainerIcon,
  Component,
  AlertCircle,
  ArchiveRestore,
  PackageOpen,
  Package
} from "lucide-react";

import AddItemForm from "@/components/AddItemForm";
import ItemView from "@/components/ItemView/ItemView";
import EditItemForm from "@/components/EditItemForm";
import { publishCollection } from "../../_actions/publishCollection";
import deleteItem from "../../_actions/deleteItem";
import { revalidatePath } from "next/cache";
import moveItemToContainer from "../../_actions/moveItemToContainer";
import removeItemFromContainer from "../../_actions/removeItemFromContainer";
import deleteContainer from "../../_actions/deleteContainer";
import { set } from "react-hook-form";

export default function CollectionPage() {
  const [collectionItems, setCollectionItems] = useState<Collection>();
  const [itemsWithoutContainers, setItemsWithoutContainers] = useState([]);
  const [containers, setContainers] = useState([]);
  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);
  const [isCreateNewCollectionDialogOpen, setIsCreateNewCollectionDialogOpen] =
    useState(false);
  const [isItemViewOpen, setIsItemViewOpen] = useState(false);
  const [itemToDisplay, setItemToDisplay] = useState<Item>();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<Item | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const [deleteContainerDialogOpen, setDeleteContainerDialogOpen] = useState(false);
  const [containerToDelete, setContainerToDelete] = useState<string | null>(null);

  const [showActions, setShowActions] = useState<string | null>(null);

  const params = useParams<{ collectionId: string }>();
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter();

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
    if (collection.itemsWithoutContainers === null) return;

    const items = collection.itemsWithoutContainers.map((item: Item) => {
      return item;
    });
    setItemsWithoutContainers(items);
  }

  async function getContainers(collection: any) {
    if (collection.containers === null) return;

    const containers = collection.containers.map((container: any) => {
      return container;
    });
    setContainers(containers);
  }

  async function fetchCollectionContent(collectionId: string) {
    try {
      const res = await fetch(
        `${baseUrl}/api/collectionStructure/${collectionId}`,
        {
          cache: "no-store", // Avoid stale data
        }
      );
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
  };

  const toggleItemView = (e: Item) => {
    if (e === itemToDisplay) {
      setIsItemViewOpen(!isItemViewOpen);
      setItemToDisplay(undefined);
      return;
    } else {
      setItemToDisplay(e);
      setIsItemViewOpen(true);
    }
  };

  const handleEditSucces = async () => {
    setIsEditDialogOpen(false);
    await fetchData();
  };

  const handleDeleteItem = async (itemId: string) => {
    await deleteItem(itemId);
    fetchData();
  };

  const handleMoveItemToContainer = async (
    itemId: string,
    containerId: string
  ) => {
    await moveItemToContainer(itemId, containerId);
    fetchData();
  };

  const handleRemoveItemFromContainer = async (itemId: string) => {
    await removeItemFromContainer(itemId);
    fetchData();
  };

  const handleDeleteContainer = async (containerId: string) => {
    await deleteContainer(containerId);
    fetchData();
  }

  if (!params.collectionId) {
    return <div>Collection not found</div>;
  }
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2 ">{collectionItems?.name}</h1>
      <p className="text-gray-600">{collectionItems?.description}</p>

      <UI.Separator className="mt-2 mb-6" />

      <div className="flex gap-4 mb-4">
        {/* <UI.Button asChild variant="outline" size="icon" className="mb-4">
          <Link href="/">
            <ChevronLeft />
          </Link>
        </UI.Button> */}

        {/* Create new collection dialog */}
        <UI.Dialog
          open={isCreateNewCollectionDialogOpen}
          onOpenChange={setIsCreateNewCollectionDialogOpen}
        >
          <div className="">
            <UI.DialogTrigger asChild>
              <UI.Button
                variant="outline"
                onClick={() => setIsCreateNewCollectionDialogOpen(true)}
              >
                New
              </UI.Button>
            </UI.DialogTrigger>
          </div>

          <UI.DialogContent className="sm:max-w-[425px]">
            <UI.DialogHeader>
              <UI.DialogTitle>Add new</UI.DialogTitle>
              <UI.DialogDescription>
                Create your container here or add an item. Click save when
                you're done.
              </UI.DialogDescription>
            </UI.DialogHeader>

            <AddItemForm
              collectionId={params.collectionId}
              onSuccess={handleFormSuccess}
            />
          </UI.DialogContent>
        </UI.Dialog>

        {/* Publish collection dialog */}
        <UI.Dialog
          open={isPublishDialogOpen}
          onOpenChange={setIsPublishDialogOpen}
        >
          <UI.DialogTrigger asChild>
            <UI.Button variant="outline">
              <Share className="h-5 w-5 mr-1" />
              Publish
            </UI.Button>
          </UI.DialogTrigger>
          <UI.DialogContent>
            <UI.DialogHeader>
              <UI.DialogTitle>Publish</UI.DialogTitle>
              <UI.DialogDescription>
                Are you sure you want to publish this collection?
              </UI.DialogDescription>
            </UI.DialogHeader>

            <div className="flex justify-end gap-4">
              <UI.Button
                variant="outline"
                onClick={() => setIsPublishDialogOpen(false)}
              >
                Cancel
              </UI.Button>
              <UI.Button onClick={handlePublish}>Publish</UI.Button>
            </div>
          </UI.DialogContent>
        </UI.Dialog>
      </div>

      <ItemView item={itemToDisplay} />

      <UI.ResizablePanelGroup
        direction="horizontal"
        className="min-h-[200px] max-w rounded-lg border md:min-w-[450px] mt-4"
      >
        <UI.ResizablePanel defaultSize={50}>
          <div className="flex flex-col h-full">
            <div className="flex gap-2 items-center p-4 mb-4 border-b">
              <Component className="h-5 w-5" />
              <h2 className="text-xl font-semibold">Items</h2>
            </div>

            {/* ITEMS LIST  */}
            <UI.ScrollArea className="flex-1 h-75">
              <div className="p-4 space-y-2">
                {itemsWithoutContainers.map((item: Item) => (
                  <div
                    key={item.itemId}
                    className={` p-2 rounded-md flex gap-2 items-center transition-colors ${
                      itemToDisplay?.itemId === item.itemId
                        ? "bg-primary text-primary-foreground"
                        : "bg-card hover:bg-muted"
                    }`}
                    onMouseEnter={() => setShowActions(item.itemId)}
                  >
                    <div
                      onClick={() => toggleItemView(item)}
                      className={`flex-[0_0_90%]
                      p-3 rounded-md cursor-pointer 
                    `}
                    >
                      <h3 className="font-medium">{item.itemName}</h3>
                      <p
                        className={`text-sm ${
                          itemToDisplay?.itemId === item.itemId
                            ? "text-primary-foreground/80"
                            : "text-muted-foreground"
                        }`}
                      >
                        {item.description}
                      </p>
                      <p
                        className={`text-sm ${
                          itemToDisplay?.itemId === item.itemId
                            ? "text-primary-foreground/80"
                            : "text-muted-foreground"
                        }`}
                      >
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    {/* Item Actions */}
                    {itemToDisplay?.itemId == item.itemId && (
                      <UI.DropdownMenu>
                        <UI.DropdownMenuTrigger asChild>
                          <UI.Button
                            variant="ghost"
                            size="icon"
                            className="flex-[0_05%]"
                          >
                            <Settings className="h-10 w-10" />
                            <span className="sr-only">Open menu</span>
                          </UI.Button>
                        </UI.DropdownMenuTrigger>

                        <UI.DropdownMenuContent align="end">
                          <UI.DropdownMenuGroup>
                            <UI.DropdownMenuSub>
                              <UI.DropdownMenuSubTrigger>
                                Move to a container
                              </UI.DropdownMenuSubTrigger>
                              <UI.DropdownMenuPortal>
                                <UI.DropdownMenuSubContent>
                                  {containers.map((container: any) => (
                                    <UI.DropdownMenuItem
                                      key={container.containerId}
                                      onClick={() =>
                                        handleMoveItemToContainer(
                                          item.itemId,
                                          container.containerId
                                        )
                                      }
                                    >
                                      {container.name}
                                    </UI.DropdownMenuItem>
                                  ))}
                                  <UI.DropdownMenuSeparator />
                                  <UI.DropdownMenuItem
                                    className="text-muted-foreground"
                                    onClick={() => {}}
                                  >
                                    Create new container
                                  </UI.DropdownMenuItem>
                                </UI.DropdownMenuSubContent>
                              </UI.DropdownMenuPortal>
                            </UI.DropdownMenuSub>
                          </UI.DropdownMenuGroup>

                          <UI.DropdownMenuItem
                            onClick={() => (
                              setItemToEdit(item), setIsEditDialogOpen(true)
                            )}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </UI.DropdownMenuItem>

                          <UI.DropdownMenuSeparator />

                          <UI.DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => (
                              setDeleteDialogOpen(true),
                              setItemToDelete(item.itemId)
                            )}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </UI.DropdownMenuItem>
                        </UI.DropdownMenuContent>
                      </UI.DropdownMenu>
                    )}
                  </div>
                ))}
              </div>
            </UI.ScrollArea>
          </div>
        </UI.ResizablePanel>

        <UI.ResizableHandle withHandle />

        <UI.ResizablePanel defaultSize={50}>
          <div className="flex flex-col h-full">
            <div className="flex p-4 mb-4 border-b items-center gap-2">
              <Package className="h-5 w-5" />
              <h2 className="text-xl font-semibold">Containers</h2>
            </div>

            {/* CONTAINERS LIST  */}
            <UI.ScrollArea className="flex-1">
              <div className="p-4 space-y-4">
                {containers.map((container: any) => (
                  <div
                    key={container.containerId}
                    className="bg-white p-4 rounded-md shadow-sm hover:shadow transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-2 group">
                      <h3 className="font-medium"><PackageOpen className="h-4 w-4 mr-2 text-muted-foreground" />
                      {container.name}</h3>
                      <UI.DropdownMenu>
                          <UI.DropdownMenuTrigger asChild>
                            <UI.Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-70 hover:opacity-100 transition-opacity"
                            >
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Container actions</span>
                            </UI.Button>
                          </UI.DropdownMenuTrigger>
                          <UI.DropdownMenuContent align="end">
                            <UI.DropdownMenuItem>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit container
                            </UI.DropdownMenuItem>
                            <UI.DropdownMenuSeparator />
                            <UI.DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => (setContainerToDelete(container.containerId), setDeleteContainerDialogOpen(true))}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete container
                            </UI.DropdownMenuItem>
                          </UI.DropdownMenuContent>
                        </UI.DropdownMenu>
                    </div>
                    
                    <div className="p-2 border-l-2 border-muted mt-2 space-y-1 rounded-md">
                      {container.items &&
                        container.items.map((item: any) => (
                          <div
                            key={item.itemId}
                            className={`flex rounded-md gap-2 p-1 items-center ${
                              itemToDisplay?.itemId === item.itemId
                                ? "bg-primary text-primary-foreground"
                                : "bg-card hover:bg-muted " 
                            }`}
                          >
                            <div
                              onClick={() => toggleItemView(item)}
                              className={` flex-[0_0_90%]
                          p-3 rounded-md cursor-pointer transition-colors 
                          `}
                            >
                              <h3 className="text-medium">{item.itemName}</h3>
                              <p
                                className={`text-sm ${
                                  itemToDisplay?.itemId === item.itemId
                                    ? "text-primary-foreground/80"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {item.description}
                              </p>
                              <p
                                className={`text-sm ${
                                  itemToDisplay?.itemId === item.itemId
                                    ? "text-primary-foreground/80"
                                    : "text-muted-foreground"
                                }`}
                              >
                                Quantity: {item.quantity}
                              </p>
                            </div>
                            
                            {/* Item Actions */}
                            {itemToDisplay?.itemId == item.itemId && (
                            <UI.DropdownMenu>
                              <UI.DropdownMenuTrigger asChild>
                                <UI.Button
                                  variant="ghost"
                                  size="icon"
                                  className="flex-[0_10%]"
                                >
                                  <Settings className="h-24 w-24" />
                                  <span className="sr-only">Open menu</span>
                                </UI.Button>
                              </UI.DropdownMenuTrigger>
                              <UI.DropdownMenuContent align="end">
                                <UI.DropdownMenuItem
                                  onClick={() =>
                                    handleRemoveItemFromContainer(item.itemId)
                                  }
                                >
                                  Remove from container
                                </UI.DropdownMenuItem>

                                <UI.DropdownMenuItem
                                  onClick={() => (
                                    setItemToEdit(item),
                                    setIsEditDialogOpen(true)
                                  )}
                                >
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Edit
                                </UI.DropdownMenuItem>

                                <UI.DropdownMenuSeparator />

                                <UI.DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => (
                                    setDeleteDialogOpen(true),
                                    setItemToDelete(item.itemId)
                                  )}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </UI.DropdownMenuItem>
                              </UI.DropdownMenuContent>
                            </UI.DropdownMenu>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </UI.ScrollArea>
          </div>
        </UI.ResizablePanel>
      </UI.ResizablePanelGroup>

      {/* Edit Item Dialog */}
      <UI.Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <UI.DialogContent className="sm:max-w-[425px]">
          <UI.DialogHeader>
            <UI.DialogTitle>Edit Item</UI.DialogTitle>
            <UI.DialogDescription>
              Edit your item here. Click submit when you're done.
            </UI.DialogDescription>
          </UI.DialogHeader>

          {itemToEdit && (
            <EditItemForm item={itemToEdit} onSucces={handleEditSucces} />
          )}
        </UI.DialogContent>
      </UI.Dialog>

      {/* Delete Item Dialog */}
      <UI.AlertDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      >
        {itemToDelete && (
          <UI.AlertDialogContent>
            <UI.AlertDialogHeader>
              <UI.AlertDialogTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                Delete Item
              </UI.AlertDialogTitle>
              <UI.AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                item from the collection.
              </UI.AlertDialogDescription>
            </UI.AlertDialogHeader>
            <UI.AlertDialogFooter>
              <UI.AlertDialogCancel>Cancel</UI.AlertDialogCancel>
              <UI.AlertDialogAction
                onClick={async () => await handleDeleteItem(itemToDelete)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </UI.AlertDialogAction>
            </UI.AlertDialogFooter>
          </UI.AlertDialogContent>
        )}
      </UI.AlertDialog>

      {/* Delete Container Dialog */}
      <UI.AlertDialog
        open={deleteContainerDialogOpen}
        onOpenChange={setDeleteContainerDialogOpen}
      >
        {containerToDelete && (
          <UI.AlertDialogContent>
            <UI.AlertDialogHeader>
              <UI.AlertDialogTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                Delete Container
              </UI.AlertDialogTitle>
              <UI.AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                container from the collection.
              </UI.AlertDialogDescription>
            </UI.AlertDialogHeader>
            <UI.AlertDialogFooter>
              <UI.AlertDialogCancel>Cancel</UI.AlertDialogCancel>
              <UI.AlertDialogAction
                onClick={async () => await handleDeleteContainer(containerToDelete)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </UI.AlertDialogAction>
            </UI.AlertDialogFooter>
          </UI.AlertDialogContent>
        )}
        </UI.AlertDialog>
    </div>
  );
}
