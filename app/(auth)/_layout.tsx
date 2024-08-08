import { Redirect, Stack } from 'expo-router';

import { useAuth } from '~/context/AuthContext';

export default function AuthLayout() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Redirect href='/(tabs)' />;
  }

  return (
    <Stack>
      <Stack.Screen name='sign-in' options={{ headerShown: false }} />
      <Stack.Screen name='sign-up' options={{ headerShown: false }} />
      <Stack.Screen
        name='verify-otp'
        options={{
          headerTitle: 'Verify OTP',
          headerTitleAlign: 'center',
          headerBackTitleVisible: false,
          headerShadowVisible: false,
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: '600',
          },
        }}
      />
    </Stack>
  );
}
