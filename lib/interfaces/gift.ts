import { Item } from './item';

interface SendGiftRequest {
  senderId: string;
  receiverId: string;
  itemId: string;
  eventId: string;
}

type RequestItemRequest = SendGiftRequest & { quantity: number };

type RequestResponse = SendGiftRequest & {
  id: string;
  sendDate: string;
  quantity: number;
  status: string;
  item: Item;
};

export { RequestItemRequest, RequestResponse, SendGiftRequest };
