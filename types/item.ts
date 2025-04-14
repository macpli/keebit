export type Item = {
    itemId: string;
    itemName: string;
    description: string;
    quantity: number;
    attributes: any;
    itemType: string;
    image: string | null;
    additionalData?: any;
  };