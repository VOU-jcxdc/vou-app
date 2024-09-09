import AsyncStorage from '@react-native-async-storage/async-storage';
import { QueryFunctionContext } from '@tanstack/react-query';

import {
  AccountsVouchersResponse,
  Event,
  EventsResponse,
  EventsVouchersResponse,
  FavoriteEventsResponse,
  IQA,
  Item,
  SearchPlayer,
  User,
} from '~/lib/interfaces';
import { doDelete, doGet, doPost, doPut, doPutImage } from '~/utils/APIRequest';

import { RequestItemRequest, RequestResponse, SendGiftRequest } from '../interfaces/gift';
import { PresignedUrl } from '../interfaces/image';
import { AccountItemsResponse } from '../interfaces/item';
import { Recipe } from '../interfaces/recipe';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;
const LIMIT = 10;

export async function fetchUser(): Promise<Pick<User, 'bucketId' | 'email' | 'phone' | 'username'>> {
  const response = await doGet(`${apiUrl}/users/profile`);
  const user = response.data;

  if (!user) {
    throw new Error('User not found');
  }

  const { username, email, phone, bucketId } = user;

  return Promise.resolve({ username, email, phone, bucketId } as Pick<
    User,
    'bucketId' | 'email' | 'phone' | 'username'
  >);
}

export async function fetchEvents({ pageParam = 0 }: { pageParam: number }): Promise<EventsResponse> {
  const offset = pageParam * LIMIT;
  const response = await doGet(`${apiUrl}/events?offset=${offset}&limit=${LIMIT}`);
  const events = response.data;

  if (!events) {
    throw new Error('Events not found');
  }

  return Promise.resolve(events as EventsResponse);
}

export async function fetchEvent({ queryKey }: QueryFunctionContext<string[]>): Promise<Event> {
  const [, id] = queryKey;

  const response = await doGet(`${apiUrl}/events/${id}`);
  const event = response.data;

  if (!event) {
    throw new Error('Event not found');
  }

  return Promise.resolve(event as Event);
}

export async function fetchFavoriteEvents(): Promise<FavoriteEventsResponse> {
  const offset = 0;
  const response = await doGet(`${apiUrl}/events/favorite-events?offset=${offset}&limit=${LIMIT}`);
  const events = response.data;

  if (!events) {
    throw new Error('Favorite events not found');
  }

  return Promise.resolve(events as FavoriteEventsResponse);
}

export async function addFavoriteEvent(params: { eventId: string }) {
  const response = await doPost(`${apiUrl}/events/favorite-events`, params);
  return response;
}

export async function removeFavoriteEvent(params: { eventId: string }) {
  const { eventId } = params;
  const response = await doDelete(`${apiUrl}/events/favorite-events/${eventId}`);
  return response;
}

export async function updateUserProfile(params: { username: string; email: string; bucketId: string | null }) {
  const response = await doPut(`${apiUrl}/users/profile`, params);
  return response;
}

export async function fetchFile({ queryKey }: QueryFunctionContext<string[]>): Promise<string> {
  const [, image] = queryKey;

  const response = await doGet(`${apiUrl}/files/${image}`);
  const file = response;

  if (!file) {
    throw new Error('File not found');
  }

  return Promise.resolve(file as string);
}

export async function createPresignedUrl(): Promise<PresignedUrl> {
  const uuid = (await AsyncStorage.getItem('uuid')) || '';
  const response = await doPost(`${apiUrl}/files/presigned-url`, {
    filename: `profile-${uuid}.jpg`,
  });
  const url = response.data;

  if (!url) {
    throw new Error('Presigned URL not found');
  }

  return Promise.resolve(url as PresignedUrl);
}

export async function createUploadPresignedUrl(params: { id: string }): Promise<PresignedUrl> {
  const uuid = (await AsyncStorage.getItem('uuid')) || '';
  const { id } = params;

  const response = await doPut(`${apiUrl}/files/presigned-url/${id}`, {
    filename: `profile-${uuid}.jpg`,
  });
  const url = response.data;

  if (!url) {
    throw new Error('Presigned URL not found');
  }

  return Promise.resolve(url as PresignedUrl);
}

export async function uploadFile(params: { file: ArrayBuffer; url: string; id: string }) {
  const { file, url, id } = params;
  const response = await doPutImage(url, file);

  if (response.status !== 200) {
    throw new Error('Upload failed');
  }

  const confirmation = await doPost(`${apiUrl}/files/upload-confirmation`, {
    id,
  });

  return confirmation;
}

export async function fetchEventVouchers({
  queryKey,
}: QueryFunctionContext<string[]>): Promise<EventsVouchersResponse[]> {
  const [, id] = queryKey;

  const response = await doGet(`${apiUrl}/events/${id}/vouchers`);
  const vouchers = response.data;

  if (!vouchers) {
    throw new Error("Event's vouchers not found");
  }

  return Promise.resolve(vouchers as EventsVouchersResponse[]);
}

export async function fetchAcountVouchers(): Promise<AccountsVouchersResponse[]> {
  const response = await doGet(`${apiUrl}/users/vouchers`);
  const vouchers = response.data;

  if (!vouchers) {
    throw new Error("User's vouchers not found");
  }

  return Promise.resolve(vouchers as AccountsVouchersResponse[]);
}

export async function updateUsedVoucher({ id }: { id: string }): Promise<AccountsVouchersResponse> {
  try {
    const response = await doPut(`${apiUrl}/users/voucher/${id}/applying`, {
      quantity: 1,
    });

    return Promise.resolve(response.data);
  } catch (error) {
    console.error('Error in updateUsedVoucher:', error);
    throw error;
  }
}

export async function fetchItem({ queryKey }: QueryFunctionContext<string[]>): Promise<Item> {
  const [, eventId] = queryKey;

  const response = await doPost(`${apiUrl}/events/${eventId}/items/assigning`, {});
  const item = response.data.item;

  if (!item) {
    throw new Error('Item not found');
  }

  return Promise.resolve(item as Item);
}

export async function upsertFcmToken(params: { fcmToken: string }) {
  try {
    const { fcmToken } = params;
    const response = await doPost(`${apiUrl}/notifications/fcm-token`, { token: fcmToken });

    return response;
  } catch (error) {
    console.error('Error upserting FCM token:', error);
    throw new Error('Error upserting FCM token');
  }
}

export async function fetchAccountItems(): Promise<AccountItemsResponse[]> {
  const response = await doGet(`${apiUrl}/items`);
  const items = response.data;

  if (!items) {
    throw new Error("User's items not found");
  }

  return Promise.resolve(items as AccountItemsResponse[]);
}

export async function fetchEventItems({ queryKey }: QueryFunctionContext<string[]>): Promise<Item[]> {
  const [, eventId] = queryKey;

  const response = await doGet(`${apiUrl}/events/${eventId}/items`);
  const items = response.data;

  if (!items) {
    throw new Error("User's items not found");
  }

  return Promise.resolve(items as Item[]);
}

export async function fetchRecipesItem({ queryKey }: QueryFunctionContext<string[]>): Promise<Recipe[]> {
  const [, id] = queryKey;

  const response = await doGet(`${apiUrl}/items/${id}/recipes`);
  const recipes = response.data;

  if (!recipes) {
    throw new Error('Recipes not found');
  }

  return Promise.resolve(recipes as Recipe[]);
}

export async function searchPlayers({ queryKey }: QueryFunctionContext<string[]>): Promise<SearchPlayer[]> {
  const [, keySearch] = queryKey;
  const offset = 0;

  const response = await doGet(`${apiUrl}/users?offset=${offset}&limit=${LIMIT}&role=player&keySearch=${keySearch}`);
  const users = response.data.accounts;

  if (!users) {
    throw new Error('Users not found');
  }

  return Promise.resolve(users as SearchPlayer[]);
}

export async function sendGift(body: SendGiftRequest) {
  try {
    const response = await doPost(`${apiUrl}/gifts/sending`, body);

    return response.data;
  } catch (error) {
    console.error('Error sending gift:', error);
    throw new Error('Error sending gift');
  }
}

export async function requestItem(body: RequestItemRequest) {
  try {
    const response = await doPost(`${apiUrl}/gifts`, body);

    return response.data;
  } catch (error) {
    console.error('Error requesting item:', error);
    throw new Error('Error requesting item');
  }
}

export async function fetchReceivedRequests(): Promise<RequestResponse[]> {
  const response = await doGet(`${apiUrl}/gifts/received-requests`);
  const requests = response.data;

  if (!requests) {
    throw new Error('Received requests not found');
  }

  return Promise.resolve(requests as RequestResponse[]);
}

export async function fetchSendedRequests(): Promise<RequestResponse[]> {
  const response = await doGet(`${apiUrl}/gifts/sent-requests`);
  const requests = response.data;

  if (!requests) {
    throw new Error('Sended requests not found');
  }

  return Promise.resolve(requests as RequestResponse[]);
}

export async function acceptRequest({ id }: { id: string }) {
  try {
    const response = await doPut(`${apiUrl}/gifts/${id}`, {});

    return response.data;
  } catch (error) {
    console.error('Error accepting request:', error);
    throw new Error('Error accepting request');
  }
}

export async function rejectRequest({ id }: { id: string }) {
  try {
    const response = await doDelete(`${apiUrl}/gifts/${id}`);

    return response.data;
  } catch (error) {
    console.error('Error rejecting request:', error);
    throw new Error('Error rejecting request');
  }
}

export async function fetchConfigs({ queryKey }: QueryFunctionContext<string[]>): Promise<any> {
  const [, id] = queryKey;

  const response = await doGet(`${apiUrl}/events/${id}/configs`);
  const config = response.data;

  if (!config) {
    throw new Error('Event not found');
  }

  return Promise.resolve(config as any);
}

export async function updateConfigs(params: { eventId: string; config: number }): Promise<any> {
  const { eventId, config } = params;
  const response = await doPost(`${apiUrl}/events/configs`, {
    eventId,
    config,
  });
  return response.data;
}

export async function combineItem({ id }: { id: string }) {
  try {
    const response = await doPost(`${apiUrl}/items/combine-items`, { id });

    return response.data;
  } catch (error) {
    console.error('Error combining item:', error);
    throw new Error('Error combining item');
  }
}

export async function fetchRoomGame({ queryKey }: QueryFunctionContext<string[]>): Promise<any> {
  const [, eventId, gameId] = queryKey;

  const response = await doGet(`${apiUrl}/events/${eventId}/games/${gameId}`);
  const room = response.data;

  if (!room) {
    throw new Error('Room not found');
  }

  return Promise.resolve(room as any);
}

export async function fetchQuizGameQAs({ queryKey }: QueryFunctionContext<string[]>): Promise<IQA[]> {
  const [, id] = queryKey;

  const response = await doGet(`${apiUrl}/quiz-game/questions?roomId=${id}`);
  const questions = response.data;

  if (!questions) {
    throw new Error('Questions not found');
  }

  return Promise.resolve(questions as IQA[]);
}
