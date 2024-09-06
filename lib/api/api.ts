import AsyncStorage from '@react-native-async-storage/async-storage';
import { QueryFunctionContext } from '@tanstack/react-query';

import {
  AccountsVouchersResponse,
  Event,
  EventsResponse,
  EventsVouchersResponse,
  FavoriteEventsResponse,
  Item,
  User,
} from '~/lib/interfaces';
import { doDelete, doGet, doPost, doPut, doPutImage } from '~/utils/APIRequest';

import { PresignedUrl } from '../interfaces/image';
import { AccountItemsResponse } from '../interfaces/item';
import { IQA } from '../interfaces/qa';
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

export async function updateUsedVoucher({ id }: { id: string }): Promise<void> {
  const response = await doPut(`${apiUrl}/users/voucher/${id}/applying`, {
    quantity: 1,
  });

  return Promise.resolve(response.data);
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

export async function fetchQuizGameQAs({ queryKey }: QueryFunctionContext<string[]>): Promise<IQA[]> {
  const [, id] = queryKey;

  const response = await doGet(`${apiUrl}/quiz-game/questions?roomId=${id}`);
  const questions = response.data;

  if (!questions) {
    throw new Error('Questions not found');
  }

  return Promise.resolve(questions as IQA[]);
}
