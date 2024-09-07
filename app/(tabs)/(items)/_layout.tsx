import { Stack } from 'expo-router';

export default function ItemsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name='index'
        options={{
          title: 'Items',
        }}
      />
      <Stack.Screen name='item-details/[id]' />
    </Stack>
  );
}
