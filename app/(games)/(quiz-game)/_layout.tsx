import { Stack } from 'expo-router';

export default function QuizGameLayout() {
  return (
    <Stack>
      <Stack.Screen
        name='index'
        options={{
          title: 'Quiz Game',
        }}
      />
    </Stack>
  );
}
