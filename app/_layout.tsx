import '~/global.css';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme, ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { Platform } from 'react-native';

import { AuthProvider } from '~/context/AuthContext';
import { NAV_THEME } from '~/lib/constants';
import { useColorScheme } from '~/lib/useColorScheme';

import messaging from '@react-native-firebase/messaging';
import useNotificationStore from '~/stores/notification';
import { handleNotification } from '~/utils/notificationUtils';
const LIGHT_THEME: Theme = {
  dark: false,
  colors: NAV_THEME.light,
};

export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const { isGranted, topics } = useNotificationStore();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

  messaging().setBackgroundMessageHandler(async () => {});

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

  React.useEffect(() => {
    const notificationListener = async () => {
      if (isGranted) {
        topics.forEach((topic) => {
          messaging().subscribeToTopic(topic);
        });

        messaging().onMessage((remoteMessage): void => {
          handleNotification(remoteMessage, topics);
        });

        messaging().onNotificationOpenedApp((remoteMessage): void => {
          handleNotification(remoteMessage, topics);
        });

        messaging()
          .getInitialNotification()
          .then((remoteMessage): void => {
            if (remoteMessage) {
              handleNotification(remoteMessage, topics);
            }
          });
      } else {
        topics.forEach((topic) => {
          messaging().unsubscribeFromTopic(topic);
        });
      }
    };

    notificationListener();
  }, [isGranted]);

  if (!isColorSchemeLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <ThemeProvider value={LIGHT_THEME}>
        <QueryClientProvider client={queryClient}>
          <StatusBar style={'dark'} />
          <AuthStack />
          <PortalHost />
        </QueryClientProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

const AuthStack = () => {
  return (
    <Stack>
      <Stack.Screen redirect name='index' />
      <Stack.Screen name='(auth)' options={{ headerShown: false }} />
      <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
      <Stack.Screen name='(games)' options={{ headerShown: false }} />
      <Stack.Screen name='+not-found' />
    </Stack>
  );
};
