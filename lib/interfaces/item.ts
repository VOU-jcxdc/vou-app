enum ItemType {
  CRAFTING_MATERIAL = 'crafting_material',
}

enum ItemStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

enum AccountItemsStatus {
  AVAILABLE = 'available',
}

interface Item {
  id: string;
  name: string;
  imageId: string;
  eventId: string;
  type: ItemType;
  status: ItemStatus;
  createdOn: string;
  updatedOn: string;
  quantity: number;
}

interface AccountItems {
  id: string;
  acountId: string;
  status: AccountItemsStatus;
  assignedDate: string;
  itemId: string;
  quantity: number;
  updatedOn: string;
}

type AccountItemsResponse = AccountItems & {
  item: Item;
};

export { AccountItems, AccountItemsResponse, Item, ItemStatus, ItemType };
