enum TargetType {
  ITEM = 'item',
  VOUCHER = 'voucher',
}

interface ItemRecipe {
  itemId: string;
  quantity: number;
  name: string;
  imageId: string;
}

interface Target {
  id: string;
  name: string;
  imageId: string;
}

interface Recipe {
  id: string;
  eventId: string;
  itemRecipe: ItemRecipe[];
  targetType: TargetType;
  targetId: string;
  createdOn: string;
  updatedOn: string;
  target: Target;
}

export { ItemRecipe, Recipe, Target, TargetType };
