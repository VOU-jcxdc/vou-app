import AsyncStorage from '@react-native-async-storage/async-storage';
import { QueryFunctionContext } from '@tanstack/react-query';

import { Event, EventsResponse, FavoriteEventsResponse, User } from '~/lib/interfaces';
import { doDelete, doGet, doImageUpload, doPost, doPut } from '~/utils/APIRequest';

import { PresignedUrl } from '../interfaces/image';

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

export async function uploadFile(params: { file: object; url: string; id: string }) {
  const { file, url, id } = params;
  const response = await doImageUpload(url, file);

  if (response.status !== 200) {
    throw new Error('Upload failed');
  }

  const confirmation = await doPost(`${apiUrl}/files/upload-confirmation`, {
    id,
  });

  return confirmation;
}
