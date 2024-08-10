import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen
        name='index'
        options={{
          title: 'Profile',
          headerRight: () => (
            <Link href='/edit-profile' asChild>
              <Ionicons name='create-outline' size={24} />
            </Link>
          ),
        }}
      />
      <Stack.Screen
        name='edit-profile'
        options={{
          title: 'Edit Profile',
          headerLeft: () => (
            <Link href='/(profile)' asChild>
              <Ionicons name='arrow-back' size={24} />
            </Link>
          ),
        }}
      />
    </Stack>
  );
}
