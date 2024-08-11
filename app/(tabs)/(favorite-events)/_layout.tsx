import { Stack } from 'expo-router';

export default function FavoriteEventsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name='index'
        options={{
          title: 'Favorite Events',
        }}
      />
      <Stack.Screen
        name='[id]'
        options={{
          title: 'Event Details',
        }}
      />
    </Stack>
  );
}
