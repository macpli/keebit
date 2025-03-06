'use client';
import React, { use, useState, useEffect } from 'react'
import { Item } from '@/types/item'
import { ChevronDown, ChevronUp, CuboidIcon as Cube, Image, Rotate3d } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

import ModelViewer from "@/components/ModelViewer/ModelViewer"

const ItemView: React.FC<{ item: Item | undefined}> = ({ item }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [showModel, setShowModel] = useState(true);

    useEffect(() => {
        const handleItemSelection = () => {
            if(item !== undefined) setIsOpen(true);
        };

        handleItemSelection();
    }, [item]);

    const handleToggleItemVIew = () => {
        setShowModel(!showModel);
    }

    return (
    
    <div style={{}}>
       
        <Collapsible open={isOpen && item !== null} onOpenChange={setIsOpen} className="border rounded-lg">
            <CollapsibleTrigger asChild>
              <div className="flex justify-between items-center p-4 cursor-pointer bg-muted/50">
                <div className="flex items-center gap-2">
                  <Cube className="h-5 w-5" />
                  <h2 className="text-lg font-medium">{item ? item.itemName : "Select an item"}</h2>
                </div>
                <Button variant="ghost" size="sm">
                  {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </div>
            </CollapsibleTrigger>
            
            <CollapsibleContent>
              <div className="p-4">
                {item ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="border rounded-lg h-[300px]">
                      {/* TODO: IMPLEMENT THREEJS 3D MODELS */}
                      <div>
                        <div className='flex  fixed z-10 p-1 items-center space-x-2'>
                            <Image />
                            <Switch onClick={handleToggleItemVIew} checked={showModel} onChange={handleToggleItemVIew} />
                            <Rotate3d />
                            {/* <Label htmlFor="airplane-mode">3D Model</Label> */}
                        </div>

                      </div>
                        {showModel ? (
                            <ModelViewer item={item}/>
                        ) : (
                            <div className='flex items-center justify-center h-full'>

                                <p>3D Model Hidden</p>
                            </div>
                        )} 
                    </div>
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium font-semibold mb-2">{item.itemName}</h3>
                      <p>{item.description}</p>
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Additional Data</h4>
                        <ul className="list-disc pl-5">
                          <li>Property 1: Value 1</li>
                          <li>Property 2: Value 2</li>
                          <li>Property 3: Value 3</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p>Select an item to view details</p>
                )}
              </div>
            </CollapsibleContent>
        </Collapsible>

        
    </div>
  )
}

export default ItemView