import { Stack } from 'expo-router';

export default function GamesLayout() {
  return (
    <Stack>
      <Stack.Screen name='(shake-game)' options={{ headerShown: false }} />
      <Stack.Screen name='(quiz-game)' options={{ headerShown: false }} />
    </Stack>
  );
}
