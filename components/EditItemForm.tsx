"use client";
import { useState, useEffect, useRef } from "react";
import { set, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Item } from "@/types/item";

import * as UI from "@/components/ui/index";
import { editItem } from "@/app/(root)/_actions/editItem";
import { encodeImageToBase64 } from "@/lib/encodeImageToBase64";

import { ImagePlus, X } from "lucide-react";  

export default function EditItemForm({ item, onSucces }: { item: Item; onSucces: () => void;}) {
  const [customTypes, setCustomTypes] = useState<string[]>([]);
  const baseItemTypes = ["keyboard", "switch"] as const;

  // For image state management
  const [base64image, setBase64Image] = useState<string | null>(item?.image || null);
  const [image, setImage] = useState<string | null>(
    item?.image ? `data:image/png;base64,${item.image}` : null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  



  const formSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    description: z.string().min(10, { message: "Description must be at least 10 characters." }),
    quantity: z.number().min(1, { message: "Quantity must be at least 1." }).optional(),
    imageBase64: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: item.itemName || "",
      description: item.description || "",
      quantity: item.quantity || 1,
      imageBase64: item?.image || "",
    },
  });

  const onSubmit = async (data: any) => {
    const newItem: Item = {
      itemId: item.itemId,
      itemName: data.name,
      description: data.description,
      quantity: data.quantity,
      itemType: item.itemType,
      attributes: item.attributes,
      image: data.imageBase64,
    };

    console.log(data)
    console.log(newItem.image);

    await editItem(newItem, item.itemId);
    onSucces();
  };

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

  return (
    <UI.Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <UI.FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <UI.FormItem>
              <UI.FormLabel>Name</UI.FormLabel>
              <UI.FormControl>
                <UI.Input placeholder={""} {...form.register("name")} />
              </UI.FormControl>
              <UI.FormMessage />
            </UI.FormItem>
          )}
        />

        <UI.FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <UI.FormItem>
              <UI.FormLabel>Description</UI.FormLabel>
              <UI.FormControl>
                <UI.Input placeholder={""} {...field} />
              </UI.FormControl>
              <UI.FormMessage />
            </UI.FormItem>
          )}
        />

        <UI.FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <UI.FormItem>
              <UI.FormLabel>Quantity</UI.FormLabel>
              <UI.FormControl>
                <UI.Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  min={1}
                />
              </UI.FormControl>
              <UI.FormMessage />
            </UI.FormItem>
          )}
        />

        <UI.FormField
          control={form.control}
          name="imageBase64"
          render={({ field }) => (
            <UI.FormItem>
              <div className="space-y-2">
                <UI.Label htmlFor="image">Image</UI.Label>
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
                      <UI.Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6"
                        onClick={removeImage}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remove image</span>
                      </UI.Button>
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
            </UI.FormItem>
          )}
        />

        <UI.Button type="submit">Submit</UI.Button>
      </form>
    </UI.Form>
  );
}
