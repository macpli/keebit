import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export enum EnumItemType {
  Keyboard = "bb6bc406-6431-4b93-96ee-41906aca6275",
  Switch = "d0fa9f3b-12b4-4c14-a9b5-92cb004e0d74"
}


export function getItemTypeId(itemTypeName: string): string | null {
  // Convert the input to match enum key format
  const normalizedInput = itemTypeName.charAt(0).toUpperCase() + itemTypeName.slice(1).toLowerCase();
  
  // Get the ID if it exists in the enum
  const itemTypeId = Object.entries(EnumItemType).find(
      ([key]) => key === normalizedInput
  )?.[1] || null;

  return itemTypeId;
}