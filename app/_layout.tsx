import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import 'expo-dev-client';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { Platform } from 'react-native';
import { AuthProvider, useAuth } from '~/context/AuthContext';
import '~/global.css';
import { NAV_THEME } from '~/lib/constants';
import { useColorScheme } from '~/lib/useColorScheme';

const LIGHT_THEME: Theme = {
  dark: false,
  colors: NAV_THEME.light,
};

export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      try {
        const theme = await AsyncStorage.getItem('theme');
        if (Platform.OS === 'web') {
          document.documentElement.classList.add('bg-background');
        }
        if (!theme) {
          await AsyncStorage.setItem('theme', colorScheme);
        }
        setIsColorSchemeLoaded(true);
      } catch (error) {
        console.error('Error loading theme:', error);
      } finally {
        SplashScreen.hideAsync();
      }
    })();
  }, [colorScheme, setColorScheme]);

  if (!isColorSchemeLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <ThemeProvider value={LIGHT_THEME}>
        <QueryClientProvider client={queryClient}>
          <StatusBar style={'dark'} />
          <AuthStack />
        </QueryClientProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

const AuthStack = () => {
  const { isAuthenticated } = useAuth();

  // console.log(isAuthenticated);

  return (
    <Stack initialRouteName={isAuthenticated ? '(tabs)' : '(auth)'}>
      <Stack.Screen name='(auth)' options={{ headerShown: false }} />
      <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
      <Stack.Screen name='+not-found' />
    </Stack>
  );
};
