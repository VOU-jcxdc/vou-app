import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Stack } from 'expo-router';
import { Pressable } from 'react-native';

export default function QuizGameLayout() {
  return (
    <Stack>
      <Stack.Screen
        name='index'
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
        name='leaderboard'
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
