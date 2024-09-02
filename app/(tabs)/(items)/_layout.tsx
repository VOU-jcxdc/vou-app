import Ionicons from '@expo/vector-icons/Ionicons';
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
      <Stack.Screen
        name='item-details/[id]'
        options={{
          title: 'Item Details',
          headerRight: () => <Ionicons name='send-outline' size={24} />,
        }}
      />
    </Stack>
  );
}
