"use client";
import { useState, useEffect } from "react";
import { set, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Item } from "@/types/item";

import * as UI from "@/components/ui/index";
import { editItem } from "@/app/(root)/_actions/editItem";

export default function EditItemForm({ item, onSucces }: { item: Item; onSucces: () => void;}) {
  const [customTypes, setCustomTypes] = useState<string[]>([]);
  const baseItemTypes = ["keyboard", "switch"] as const;


  const formSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    description: z.string().min(10, { message: "Description must be at least 10 characters." }),
    quantity: z.number().min(1, { message: "Quantity must be at least 1." }).optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: item.itemName || "",
      description: item.description || "",
      quantity: item.quantity || 1,
    },
  });

  useEffect(() => {
        console.log(item);
  }, []);

  const onSubmit = async (data: any) => {

    const newItem: Item = {
        itemId: item.itemId,
        itemName: data.name,
        description: data.description,
        quantity: data.quantity,
        itemType: item.itemType,
        attributes: item.attributes,
    }

    await editItem(newItem, item.itemId);
    onSucces();
  }


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
                        <UI.Input placeholder={''}  
                          {...form.register("name")} 
                        />
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
                        <UI.Input placeholder={''} {...field} />
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
                
                <UI.Button type="submit">Submit</UI.Button>
              </form>
            </UI.Form>
    )
}