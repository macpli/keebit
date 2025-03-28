"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import  addItem  from "../app/(root)/_actions/addItem"
import React, { useEffect, useState } from 'react';

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import addItemType from "@/app/(root)/_actions/addItemType"
import getItemTypes from "@/app/(root)/_actions/getItemTypes"

export default function AddItemForm({ collectionId, onSuccess }: { collectionId: string; onSuccess: () => void; }) {
  const [customTypes, setCustomTypes] = useState<string[]>([]);
  const baseItemTypes = ["keyboard", "switch"] as const;

  const formSchema = z.object({
    type: z.enum(["item", "container", "createItemType"]),
    itemType: z.union([z.enum(baseItemTypes), z.string()]).optional(), // Allow dynamic values
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    description: z.string().min(10, { message: "Description must be at least 10 characters." }),
    quantity: z.number().min(1, { message: "Quantity must be at least 1." }).optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      quantity: 1,
    },
  });

  const selectedType = form.watch("type");

  useEffect(() => {
    async function fetchItemTypes() {
      const response = await getItemTypes();

  
      if (response.length > 0) {
        setCustomTypes(response);
      }
    }
  
    fetchItemTypes();
  }, []);

  const onSubmit = async (data: any) => {
    try {
      if (selectedType === "item") {
        await addItem(data, collectionId);
      } else if (selectedType === "container") {
        console.log("Adding Container");
      } else if (selectedType === "createItemType") {
        await addItemType(data);
      } else {
        console.error("Invalid Type");
      }
      onSuccess(); // Call the success callback
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="item">Item</SelectItem>
                  <SelectItem value="container">Container</SelectItem>
                  <SelectItem value="createItemType">Item Type</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedType === 'item' && (
        <FormField
          control={form.control}
          name="itemType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Item Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an item type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="keyboard">Keyboard</SelectItem>
                  <SelectItem value="switch">Switch</SelectItem>
                  {customTypes.map((type: any, idx) => (
                    <SelectItem key={idx} value={type.name}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />)}
        
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder={selectedType == 'item' ? "Cherry MX Black"
                  : selectedType == 'container' ? "Switch Container" 
                  : selectedType == 'createItemType' ? "Keyboard / Switch / Tool etc" 
                  : ""} 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder={selectedType == 'item' ? "OG Linear switch" 
                  : selectedType == 'container' ? "Container for switches" 
                  : selectedType == 'createItemType' ? "Tools used for keyboard building" 
                  : ""
                } {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedType === 'item' && (
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantity</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field} 
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  min={1}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />)}
        
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}

