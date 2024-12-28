export type Item = {
    id: string;
    collectionId: string;
    containerId?: string;
    typeId?: string;
    name: string;
    description?: string;
    quantity: number;
    attributes?: Record<string, any>; // Elastyczne dane JSON
    createdAt: string;
    updatedAt: string;
  };