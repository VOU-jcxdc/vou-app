import { Stack } from 'expo-router';

export default function EventsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name='index'
        options={{
          title: 'Events',
        }}
      />
      <Stack.Screen
        name='event-details/[id]'
        options={{
          title: 'Event Details',
        }}
      />
    </Stack>
  );
}
