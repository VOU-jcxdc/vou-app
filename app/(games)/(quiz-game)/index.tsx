import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { Text, View } from 'react-native';
import io from 'socket.io-client';

interface IQA {
  question: string;
  options: string[];
  answer: number;
}

export default function QuizGame() {
  const [numPlayers, setNumPlayers] = React.useState(0);
  const [status, setStatus] = React.useState('');
  const [countdown, setCountdown] = React.useState<number>(0);
  const [currentQA, setCurrentQA] = React.useState<IQA | null>(null);
  const [listQA, setListQA] = React.useState<IQA[]>([]);

  React.useEffect(() => {
    async function connectSocket() {
      const token = (await AsyncStorage.getItem('token')) || '';
      const socket = io('ws://192.168.1.40:3000/quiz-game', {
        extraHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
      socket.on('connect', () => {
        console.log('connected');
      });

      socket.on('waiting-players', (data: { message: string; questions: IQA[] }) => {
        setStatus('Waiting for players to join');
        setListQA(data.questions);
      });

      socket.on('player-joined', (data: { numPlayers: number }) => {
        console.log('new-player', data);

        setNumPlayers((current) => current + 1);
      });

      socket.on('game-start', () => {
        setStatus('Game is starting');
      });

      socket.on('start-question', (data: { noQa: number }) => {
        setStatus('Question is being asked');
        console.log(data.noQa);
        console.log(listQA[data.noQa]);
        setCurrentQA(listQA[data.noQa]);
        startCountdown(10); // Start countdown when question starts
      });

      socket.on('end-question', (data: { message: string }) => {
        setStatus(data.message);
        setCountdown(10); // Clear countdown when question ends
      });
    }

    connectSocket();
  }, []);

  // Countdown logic
  const startCountdown = (timeLeft: number) => {
    setCountdown(timeLeft);
    const intervalId = setInterval(() => {
      setCountdown((current) => {
        if (current <= 1) {
          clearInterval(intervalId);
          return 0;
        } else {
          return current - 1;
        }
      });
    }, 1000);
  };

  return (
    <View>
      <Text>Quiz Game: {numPlayers} players</Text>
      <Text>Status: {status}</Text>
      <Text>Question: {currentQA?.question}</Text>
      {currentQA !== null &&
        currentQA.options.map((option, index) => (
          <Text key={index}>
            {index + 1}. {option}
          </Text>
        ))}
      {countdown !== null && <Text>Time left: {countdown} seconds</Text>}
      {countdown === 0 && <Text>Answer: {currentQA?.options[currentQA.answer]}</Text>}
    </View>
  );
}
