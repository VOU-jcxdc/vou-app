import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { Text, View } from 'react-native';
import io from 'socket.io-client';

export default function QuizGame() {
  React.useEffect(() => {
    async function connectSocket() {
      const token = (await AsyncStorage.getItem('token')) || '';
      const socket = io('ws://10.0.2.2:3000/quiz-game', {
        extraHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
      socket.on('connect', () => {
        console.log('connected');
      });
    }

    connectSocket();
  }, []);

  return (
    <View>
      <Text>Quiz Game</Text>
    </View>
  );
}
