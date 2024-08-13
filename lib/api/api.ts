import { QueryFunctionContext } from '@tanstack/react-query';
import { useAuth } from '~/context/AuthContext';
import { Event, EventsResponse, User } from '~/lib/interfaces';
import { doGet, doPost } from '~/utils/APIRequest';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export async function fetchUser(): Promise<Pick<User, 'bucketId' | 'email' | 'phone' | 'username'>> {
  const response = await doGet(`${apiUrl}/user/profile`);
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

export async function fetchEvents(): Promise<EventsResponse> {
  const offset = 0;
  const limit = 10;
  const response = await doGet(`${apiUrl}/events?offset=${offset}&limit=${limit}`);
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

export async function fetchFile({ queryKey }: QueryFunctionContext<string[]>): Promise<string> {
  const [, image] = queryKey;

  const response = await doGet(`${apiUrl}/files/${image}`);
  const file = response;

  if (!file) {
    throw new Error('File not found');
  }

  return Promise.resolve(file as string);
}

export async function createPresignedUrl(): Promise<string> {
  const { uuid } = useAuth();
  const response = await doPost(`${apiUrl}/files/presigned-url`, {
    filename: `profile-${uuid}.jpg`,
  });
  const url = response.data;

  if (!url) {
    throw new Error('Presigned URL not found');
  }

  return Promise.resolve(url as string);
}
