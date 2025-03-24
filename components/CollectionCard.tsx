'use client';
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState, useRef } from "react";

import { PatternPlaceholder } from "./PatternPlaceholder"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,Separator, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DialogTrigger, Dialog, DialogContent, DialogHeader, DialogDescription, DialogTitle } from "@/components/ui/index"
import { Share, FolderIcon, AlertCircle, PlusCircle, Trash2, Pencil, MoreVertical } from "lucide-react"

import { Collection } from "@/types/collection"
import { deleteCollection } from "@/app/(root)/_actions/deleteCollection";
import CreateCollectionDialog from "./CreateCollectionDialog";
import { getItemsCountAction } from "@/app/(root)/_actions/getItemsCountAction";
import { publishCollection } from "@/app/(root)/_actions/publishCollection";
import { set } from "react-hook-form";

function base64ToImage(base64: string): string {
  return `data:image/png;base64,${base64}`;
}


export function CollectionCard({collection}: {collection: Collection}) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [collectionToDelete, setCollectionToDelete] = useState<string | null>(null)
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [collectionToEdit, setCollectionToEdit] = useState<string | null>(null)
  const [editFormData, setEditFormData] = useState({
    name: collection.name,
    description: collection.description,
    image: collection
  })
  const [itemCount, setItemCount] = useState<number>(0);

  const fetchedItems = useRef<string | null>(null);  
  
  const imageUrl = base64ToImage(collection.image)
  
  const handleEditCollection = (collectionId: string) => {
    setCollectionToEdit(collectionId);
    setEditDialogOpen(true)
  }

  const handleSubmitEdit = async () => {
    setEditDialogOpen(false);
  }

  const openPublishDialog = async () => {
    setPublishDialogOpen(true);
  }

  const handlePublicCollection = async (collectionId: string) => {
    await publishCollection(collectionId);
    setPublishDialogOpen(false);
  }  
  
  const handleDeleteCollection = async (collectionId: string) => {
    setCollectionToDelete(collectionId);
    setDeleteDialogOpen(true)
  
  }
  
  const confirmDeleteCollection = async () => {
    if(collectionToDelete === null) return;

    await deleteCollection(collectionToDelete);
    setCollectionToDelete(null);
    setDeleteDialogOpen(false);
  }

  const getItems = async (collectionId: string) => {
    const {count} = await getItemsCountAction(collectionId);
    setItemCount(count);
    return count;
  }

  useEffect(() => {
    if(collection?.id && fetchedItems.current !== collection.id) {
      getItems(collection.id);
      fetchedItems.current = collection.id;
    }
  }, [collection?.id])

  let dialogKey = Date.now();  

  return(
    <div>

      <Card key={collection.id} className="overflow-hidden">
        <CardHeader className="pb-4 flex flex-row items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FolderIcon className="h-5 w-5" />
              {collection.name}
            </CardTitle>
            <CardDescription>{collection.description}</CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">

              <DropdownMenuItem onClick={() => handleEditCollection(collection.id)}>
                <Pencil className="mr-2 h-4 w-4" />
                  Edit
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => openPublishDialog()}>
                <Share className="mr-2 h-4 w-4" />
                  Publish
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={async () => await handleDeleteCollection(collection.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>

            </DropdownMenuContent>
            </DropdownMenu>
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
            <div className="text-sm text-muted-foreground">{itemCount} items</div>
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Delete Collection
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the collection and all its items.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => await confirmDeleteCollection()}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Collection Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="h-5 w-5" />
              Edit Collection
            </DialogTitle>
            <DialogDescription>Make changes to your collection here. Click save when you're done.</DialogDescription>
          </DialogHeader>
          <CreateCollectionDialog collection={collection} type={"edit"} collectionId={collection.id} onClose={handleSubmitEdit}/>
        </DialogContent>
      </Dialog>

      {/* Publish Collection Dialog */}
      <Dialog open={publishDialogOpen} onOpenChange={setPublishDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Share className="h-5 w-5" />
              Publish Collection
            </DialogTitle>
            <DialogDescription>
              Publish your collection here. Click publish if you're sure.
            </DialogDescription>
          </DialogHeader>
            <Button
              onClick={async () => await handlePublicCollection(collection.id)}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Publish
            </Button>
          
        </DialogContent>
      </Dialog>
    </div>
  )
}