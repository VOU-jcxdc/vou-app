import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Stack } from 'expo-router';
import { Pressable } from 'react-native';

export default function QuizGameLayout() {
  return (
    <Stack>
      <Stack.Screen
        name='play'
        options={{
          title: 'Quiz Game',
          headerLeft: () => (
            <Pressable onPress={() => router.back()}>
              <Ionicons name='arrow-back' size={24} />
            </Pressable>
          ),
        }}
      />
      <Stack.Screen
        name='index'
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='complete'
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='leaderboard'
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
