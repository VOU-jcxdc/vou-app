enum ItemType {
  CRAFTING_MATERIAL = 'crafting_material',
  CONFIG = 'config',
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
  status: AccountItemsStatus;
  assignedDate: string;
  quantity: number;
}

type AccountItemsResponse = AccountItems & {
  item: Item;
};

export { AccountItems, AccountItemsResponse, Item, ItemStatus, ItemType };
