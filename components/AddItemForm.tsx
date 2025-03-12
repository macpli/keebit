"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import  addItem  from "../app/(root)/_actions/addItem"
import React, { useState } from 'react';

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
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

const formSchema = z.object({
  type: z.enum(["item", "container"], {
    required_error: "Please select a type.",
  }),
  itemType: z.enum(["keyboard", "switch"],{
    required_error: "Please select an item type.",
  }),
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Phone number must be at least 10 digits.",
  }),
  quantity: z.number().min(1, {
    message: "Quantity must be at least 1.",
  }),
})

export default function AddItemForm({ collectionId, onSuccess }: { collectionId: string; onSuccess: () => void; }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      quantity: 1,
    },
  })

  const [selectedType, setSelectedType] = useState('');

  const onSubmit = async (data: any) => {
    try {
      if (selectedType === 'item') {
        await addItem(data, collectionId);
      } else if (selectedType === 'container') {
        // await addContainer(data, collectionId);
        console.log('Adding Container');
      } else {
        console.error('Invalid Type');
      }
      onSuccess(); // Call the success callback
    } catch (error) {
      console.error('Error submitting form:', error);
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
              <Select onValueChange={(value) => { field.onChange(value); setSelectedType(value); }} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="item">Item</SelectItem>
                  <SelectItem value="container">Container</SelectItem>
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
                <Input placeholder="Cherry MX Black" {...field} />
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
                <Input placeholder="OG Linear Switch" {...field} />
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

