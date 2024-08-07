import { doGet } from '~/utils/APIRequest';
import { User } from '../interfaces/user';

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
