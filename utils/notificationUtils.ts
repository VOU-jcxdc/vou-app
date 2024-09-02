import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import { router } from 'expo-router';
import { PermissionsAndroid } from 'react-native';
import { upsertFcmToken } from '~/lib/api/api';

export const requestUserNotificationPermission = async (): Promise<boolean> => {
  let isGrantedNotification = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
  const isRequestFirstTime = (await AsyncStorage.getItem('isRequestFirstTime')) || 'true';

  if (isRequestFirstTime === 'true') {
    let permissionAppGranted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    await AsyncStorage.setItem('isRequestFirstTime', 'false');
    if (permissionAppGranted === PermissionsAndroid.RESULTS.GRANTED) {
      isGrantedNotification = true;
    } else {
      isGrantedNotification = false;
    }
  }

  if (isGrantedNotification === true) {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      await upsertToken();
    }
  }

  return isGrantedNotification;
};

const upsertToken = async () => {
  const fcmToken = await messaging().getToken();
  await upsertFcmToken({ fcmToken });
};

const handlePersonalNotification = async (data: any) => {
  const { tag } = data;
  switch (tag) {
    case 'begin_fav_event':
      const { eventId } = data as { eventId: string };
      if (eventId) {
        router.navigate({
          pathname: '/event-details/[id]',
          params: {
            id: eventId,
            favorite: 'true',
          },
        });
      }
      break;
    default:
      break;
  }
};

const handleTopicNotification = async (data: any) => {};

export const handleNotification = async (remoteMessage: any, topics: string[]) => {
  const { from } = remoteMessage;
  const topic = from?.replace('/topics/', '');
  if (topics.includes(topic)) {
    handleTopicNotification(remoteMessage.data);
  } else {
    handlePersonalNotification(remoteMessage.data);
  }
};
