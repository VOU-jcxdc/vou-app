import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Stack } from 'expo-router';
import { Pressable } from 'react-native';

export default function ShakeGameLayout() {
  return (
    <Stack>
      <Stack.Screen
        name='index'
        options={{
          title: 'Shake Game',
          headerLeft: () => (
            <Pressable onPress={() => router.back()}>
              <Ionicons name='arrow-back' size={24} />
            </Pressable>
          ),
          headerRight: () => (
            <Pressable
              onPress={() => {
                router.push({
                  pathname: '/instruction',
                });
              }}>
              <Ionicons name='information-circle-outline' size={32} />
            </Pressable>
          ),
        }}
      />
      <Stack.Screen
        name='inventory'
        options={{
          title: 'Event Items',
          headerLeft: () => (
            <Pressable onPress={() => router.back()}>
              <Ionicons name='arrow-back' size={24} />
            </Pressable>
          ),
        }}
      />
      <Stack.Screen
        name='instruction'
        options={{
          title: 'Instruction',
          headerLeft: () => (
            <Pressable onPress={() => router.back()}>
              <Ionicons name='arrow-back' size={24} />
            </Pressable>
          ),
        }}
      />
    </Stack>
  );
}
