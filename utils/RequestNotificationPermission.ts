import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import { PermissionsAndroid } from 'react-native';
import { upsertFcmToken } from '~/lib/api/api';

export const requestUserNotificationPermissionFirstTime = async () => {
  console.log('Requesting notification permission');
  const isGrantedNotification = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
  console.log('isGrantedNotification:', isGrantedNotification);
  const isRequestFirstTime = (await AsyncStorage.getItem('isRequestFirstTime')) || 'true';

  if (isGrantedNotification === false && isRequestFirstTime === 'true') {
    let permissionAppGranted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    await AsyncStorage.setItem('isRequestFirstTime', 'false');

    if (permissionAppGranted === PermissionsAndroid.RESULTS.GRANTED) {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (!enabled) {
        permissionAppGranted = PermissionsAndroid.RESULTS.DENIED;
      }
      await upsertToken();
    }
  } else if (isGrantedNotification === true) {
    await upsertToken();
  }
};

const upsertToken = async () => {
  const fcmToken = await messaging().getToken();
  console.log('FCM Token:', fcmToken);
  await upsertFcmToken({ fcmToken });
};
