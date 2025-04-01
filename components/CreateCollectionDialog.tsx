"use client";
import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { PlusCircle, ImagePlus, X } from "lucide-react";
import { Button, Input, Label } from "@/components/ui/index";
import { addCollection } from "../app/(root)/_actions/addCollection";
import { editCollection } from "@/app/(root)/_actions/editCollection";

import { encodeImageToBase64 } from "@/lib/encodeImageToBase64";
import { Collection } from "@/types/collection";

// Validation schema using zod
const formSchema = z.object({
  name: z.string().min(1, { message: "Name cannot be empty." }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters." }),
  imageBase64: z.string().optional(),
});

const CreateCollectionDialog = ({
  type,
  collectionId,
  onClose,
  collection,
}: {
  type: string;
  collectionId?: string;
  onClose?: () => void;
  collection?: Collection;
}) => {
  const [image, setImage] = useState<string | null>(
    collection?.image ? `data:image/png;base64,${collection.image}` : null
  );

  const [base64image, setBase64Image] = useState<string | null>(
    collection?.image || null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: collection?.name || "",
      description: collection?.description || "",
      imageBase64: collection?.image || "",
    },
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64String = await encodeImageToBase64(file);
      const strippedBase64String = base64String.replace(
        /^data:image\/[a-z]+;base64,/,
        ""
      );
      setBase64Image(strippedBase64String);
      setImage(base64String);
      form.setValue("imageBase64", strippedBase64String);
    }
  };

  const removeImage = () => {
    setImage(null);
    setBase64Image(null);
    form.setValue("imageBase64", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    if (data.imageBase64) {
      formData.append("imageBase64", data.imageBase64);
    }

    if (type === "add") {
      await addCollection(formData);
    } else if (type === "edit") {
      if (!collectionId || !onClose) return;
      await editCollection(formData, collectionId);
      onClose();
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <Input
            {...form.register("name")}
            id="name"
            name="name"
            className="col-span-3"
          />
          <p className="text-sm text-red-500">
            {form.formState.errors.name?.message}
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="description" className="text-right">
            Description
          </Label>
          <Input
            {...form.register("description")}
            id="description"
            name="description"
            className="col-span-3"
          />
          <p className="text-sm text-red-500">
            {form.formState.errors.description?.message}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">Image</Label>
          <div className="flex flex-col gap-4">
            <div
              className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                id="image"
                name="image"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
              <ImagePlus className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                Click to upload an image
              </p>
            </div>

            {image && (
              <div className="relative">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6"
                  onClick={removeImage}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove image</span>
                </Button>
                <img
                  src={image || "/placeholder.svg"}
                  alt="Preview"
                  className="rounded-md max-h-[200px] w-full object-cover"
                />
                <input
                  type="hidden"
                  name="imageBase64"
                  value={base64image || ""}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <Button type="submit" className="mt-4 w-full">
        Submit
      </Button>
    </form>
  );
};

export default CreateCollectionDialog;
