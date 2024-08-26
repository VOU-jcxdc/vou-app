import messaging from '@react-native-firebase/messaging';
import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { requestUserNotificationPermissionFirstTime } from '~/utils/RequestNotificationPermission';

interface NotificationContextType {
  title: string;
  body: string;
  data: object;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [data, setData] = useState({});

  useEffect(() => {
    requestUserNotificationPermissionFirstTime();
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  });

  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('Message handled in the background!', remoteMessage);
  });

  return <NotificationContext.Provider value={{ title, body, data: {} }}>{children}</NotificationContext.Provider>;
};
