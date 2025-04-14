"use client";
import React, { use, useState, useEffect } from "react";
import Image from "next/image";
import { Item } from "@/types/item";
import {
  ChevronDown,
  ChevronUp,
  CuboidIcon as Cube,
  Image as ImageIcon,
  Rotate3d,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import ModelViewer from "@/components/ModelViewer/ModelViewer";
import { base64ToImage } from "@/lib/base64ToImage";

import getDefaultItemTypes from "@/app/(root)/_actions/getDefaultItemTypes";

const ItemView: React.FC<{ item: Item | undefined }> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [showModel, setShowModel] = useState(true);
  const [isDefaultType, setIsDefaultType] = useState(false);

  const imageUrl = item?.image ? base64ToImage(item.image) : "";

  useEffect(() => {
    const handleItemSelection = () => {
      if (item !== undefined) setIsOpen(true);
    };

    const checkIfDefaultType = async () => {
      const defaultTypes = await getDefaultItemTypes();

      setIsDefaultType(
        defaultTypes.some((type) => type.name === item?.itemType)
      );
    };

    console.log(item);
    handleItemSelection();
    checkIfDefaultType();
  }, [item]);

  const handleToggleItemVIew = () => {
    setShowModel(!showModel);
  };

  return (
    <div style={{}}>
      <Collapsible
        open={isOpen && item !== null}
        onOpenChange={setIsOpen}
        className="border rounded-lg"
      >
        <CollapsibleTrigger asChild>
          <div className="flex justify-between items-center p-4 cursor-pointer bg-muted/50">
            <div className="flex items-center gap-2">
              <Cube className="h-5 w-5" />
              <h2 className="text-lg font-medium">
                {item ? item.itemName : "Select an item"}
              </h2>
            </div>
            <Button variant="ghost" size="sm">
              {isOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="p-4">
            {item ? (
              // Model Viewer
              <div className="grid grid-cols-[2fr_1fr] gap-4">
                <div className="border rounded-lg h-[400px]">
                  <div className="flex absolute z-10 p-1 items-center space-x-2">
                    <ImageIcon />
                    <Switch
                      onClick={handleToggleItemVIew}
                      checked={showModel}
                      onChange={handleToggleItemVIew}
                    />
                    <Rotate3d />
                  </div>

                  {showModel && isDefaultType ? (
                    <ModelViewer item={item} />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      {imageUrl.length == 0 ? (
                        <p>3D Model Hidden</p>
                      ) : (
                        <Image
                          src={imageUrl}
                          alt={`${item.itemName} preview`}
                          width={500}
                          height={500}
                          sizes="(max-width: 768px) 100vw, 400px"
                        />
                      )}
                    </div>
                  )}
                </div>

                {/* Item Details */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium font-semibold mb-2">
                    {item.itemName}
                  </h3>
                  <p>{item.description}</p>
                  
                  {item.additionalData && (

                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Additional Data</h4>
                      <ul>
                        {Object.entries(item.additionalData).map(
                          ([key, value]) => (
                            <li key={key}>
                              <strong>{key}:</strong> {String(value)}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p>Select an item to view details</p>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default ItemView;
