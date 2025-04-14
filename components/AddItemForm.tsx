"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import addItem from "../app/(root)/_actions/addItem";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import addItemType from "@/app/(root)/_actions/addItemType";
import getItemTypes from "@/app/(root)/_actions/getItemTypes";
import addContainer from "@/app/(root)/_actions/addContainer";
import getDefaultItemTypes from "@/app/(root)/_actions/getDefaultItemTypes";
import { ItemType } from "@/types/itemType";
import { Card, CardContent } from "./ui/card";
import { PlusCircle, X } from "lucide-react";

export default function AddItemForm({
  collectionId,
  onSuccess,
}: {
  collectionId: string;
  onSuccess: () => void;
}) {
  const [additionalDataPairs, setAdditionalDataPairs] = useState([
    { key: "", value: "" },
  ]);
  const [customTypes, setCustomTypes] = useState<string[]>([]);
  const [defaultItemTypes, setDefaultItemTypes] = useState<ItemType[]>([]);
  const formSchema = z.object({
    type: z.enum(["item", "container", "createItemType"]),
    itemType: z
      .union([
        z.enum(
          (defaultItemTypes.length > 0
            ? defaultItemTypes.map((type) => type.name)
            : ["placeholder"]) as [string, ...string[]]
        ),
        z.string(),
      ])
      .optional(),
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    description: z
      .string()
      .min(10, { message: "Description must be at least 10 characters." }),
    quantity: z
      .number()
      .min(1, { message: "Quantity must be at least 1." })
      .optional(),
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

  // Function to add a new key-value pair
  const addKeyValuePair = () => {
    setAdditionalDataPairs([...additionalDataPairs, { key: "", value: "" }]);
  };

  // Function to remove a key-value pair
  const removeKeyValuePair = (index: number) => {
    const newPairs = [...additionalDataPairs];
    newPairs.splice(index, 1);
    setAdditionalDataPairs(newPairs);
  };

  // Function to update a key-value pair
  const updateKeyValuePair = (index: number, field: any, value: any) => {
    const newPairs: any = [...additionalDataPairs];
    newPairs[index][field] = value;
    setAdditionalDataPairs(newPairs);
  };

  useEffect(() => {
    async function fetchItemTypes() {
      const response = await getItemTypes();
      const defaultTypes = await getDefaultItemTypes();

      if (response.length > 0) {
        setCustomTypes(response);
      }

      if (defaultTypes.length > 0) {
        setDefaultItemTypes(defaultTypes);
      }
    }

    fetchItemTypes();
  }, []);

  const handleSubmit = (data: any) => {
    // Only include non-empty key-value pairs
    const validPairs = additionalDataPairs.filter((pair) => pair.key.trim() !== "")

    // Convert array of pairs to object if there are valid pairs
    if (validPairs.length > 0 && selectedType === "item") {
      const additionalData: any = {}
      validPairs.forEach((pair) => {
        if (pair.key.trim()) {
          additionalData[pair.key] = pair.value
        }
      })
      data.additionalData = additionalData
    }

    onSubmit(data)
  }

  const onSubmit = async (data: any) => {
    try {
      if (selectedType === "item") {
        let isDefaultType = false;
        isDefaultType = defaultItemTypes.some(
          (type) => type.name === data.itemType
        );

        await addItem(data, collectionId, isDefaultType);
      } else if (selectedType === "container") {
        await addContainer(data.name, data.description, collectionId);
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
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
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

        {selectedType === "item" && (
          <FormField
            control={form.control}
            name="itemType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Item Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an item type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {defaultItemTypes.map((type: any, idx) => (
                      <SelectItem key={idx} value={type.name}>
                        {type.name}
                      </SelectItem>
                    ))}

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
          />
        )}

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder={
                    selectedType == "item"
                      ? "Cherry MX Black"
                      : selectedType == "container"
                      ? "Switch Container"
                      : selectedType == "createItemType"
                      ? "Keyboard / Switch / Tool etc"
                      : ""
                  }
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
                <Input
                  placeholder={
                    selectedType == "item"
                      ? "OG Linear switch"
                      : selectedType == "container"
                      ? "Container for switches"
                      : selectedType == "createItemType"
                      ? "Tools used for keyboard building"
                      : ""
                  }
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedType === "item" && (
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
          />
        )}

        {/* Additional Data Section - Only shown for items */}
        {selectedType === "item" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <FormLabel className="text-base">Additional Data</FormLabel>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addKeyValuePair}
                className="flex items-center gap-1"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Add Field</span>
              </Button>
            </div>

            <Card>
              <CardContent className="pt-6">
                {additionalDataPairs.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-2">
                    No additional data. Click "Add Field" to add key-value
                    pairs.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {additionalDataPairs.map((pair, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          placeholder="Key"
                          value={pair.key}
                          onChange={(e) =>
                            updateKeyValuePair(index, "key", e.target.value)
                          }
                          className="flex-1"
                        />
                        <Input
                          placeholder="Value"
                          value={pair.value}
                          onChange={(e) =>
                            updateKeyValuePair(index, "value", e.target.value)
                          }
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeKeyValuePair(index)}
                          className="h-10 w-10 shrink-0"
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
