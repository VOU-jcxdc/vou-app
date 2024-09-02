import { Stack } from 'expo-router';
import React from 'react';
import { AppState } from 'react-native';
import useNotificationStore from '~/stores/notification';
import { requestUserNotificationPermission } from '~/utils/notificationUtils';

export default function EventsLayout() {
  const { setIsGranted } = useNotificationStore();
  const [appState, setAppState] = React.useState(AppState.currentState);

  const checkNotificationPermission = async () => {
    const granted = await requestUserNotificationPermission();
    setIsGranted(granted);
  };

  React.useEffect(() => {
    (async () => {
      AppState.addEventListener('change', handleAppStateChange);
      checkNotificationPermission();
    })();
  }, []);

  const handleAppStateChange = (nextAppState: any) => {
    if (appState.match(/inactive|background/) && nextAppState === 'active') {
      checkNotificationPermission();
    }
    setAppState(nextAppState);
  };

  return (
    <Stack>
      <Stack.Screen
        name='index'
        options={{
          title: 'Events',
        }}
      />
      <Stack.Screen
        name='event-details/[id]'
        options={{
          title: 'Event Details',
        }}
      />
    </Stack>
  );
}
