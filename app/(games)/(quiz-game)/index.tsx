import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { Text, View } from 'react-native';
import io from 'socket.io-client';
import { Button } from '~/components/ui/button';
import { fetchQuizGameQAs } from '~/lib/api/api';
import { IQA } from '~/lib/interfaces/qa';

export default function QuizGame() {
  const [numPlayers, setNumPlayers] = React.useState(0);
  const [status, setStatus] = React.useState('');
  const [countdown, setCountdown] = React.useState<number>(0);
  const [currentQA, setCurrentQA] = React.useState<IQA | null>(null);
  const [isShowAnswer, setIsShowAnswer] = React.useState<boolean>(false);
  const countdownIntervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const listQARef = React.useRef<IQA[]>([]);
  const socketRef = React.useRef(io(''));

  const roomId = '66deabaa5e5dd940bcd22c37';
  const { data, isPending } = useQuery({
    queryKey: ['quiz-game-qas', roomId], //roomId
    queryFn: fetchQuizGameQAs,
  });

  React.useEffect(() => {
    if (isPending) {
      return;
    }
    listQARef.current = data || [];
  }, [data]);

  React.useEffect(() => {
    async function connectSocket() {
      const token = (await AsyncStorage.getItem('token')) || '';
      const socket = io('ws://192.168.1.40:3000/quiz-game', {
        extraHeaders: {
          Authorization: `Bearer ${token}`,
        },
        query: {
          roomId, //roomId
        },
      });
      socketRef.current = socket;
      socket.on('connect', () => {
        console.log('connected');
      });

      socket.on('waiting-players', (data: { message: string }) => {
        setStatus(data.message);
      });

      socket.on('player-joined', (data: { message: string }) => {
        console.log('question', data);

        setNumPlayers((current) => current + 1);
        setStatus(data.message);
      });

      socket.on('game-start', () => {
        setStatus('Game is starting');
      });

      socket.on('start-question', (data: { noQa: number }) => {
        setIsShowAnswer(false);
        setStatus('Question is being asked');
        console.log(data.noQa);
        console.log('list', listQARef.current);
        setCurrentQA(listQARef.current[data.noQa]);
        startCountdown(10); // Start countdown when question starts
      });

      socket.on('answer-question', (data: { message: string }) => {
        setStatus(data.message);
        startCountdown(10); // Start countdown when answer is shown
      });

      socket.on('show-answer', (data: { message: string }) => {
        setStatus(data.message);
        startCountdown(10); // Start countdown when answer is shown
        setIsShowAnswer(true);
      });
    }

    connectSocket();
  }, []);

  // Countdown logic
  const startCountdown = (timeLeft: number) => {
    // Clear previous interval
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }

    setCountdown(timeLeft);
    countdownIntervalRef.current = setInterval(() => {
      setCountdown((current) => {
        if (current <= 1) {
          clearInterval(countdownIntervalRef.current!);
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
        currentQA?.options.map((option, index) => (
          <Text key={index}>
            {index + 1}. {option}
          </Text>
        ))}
      <Button
        className='m-auto'
        onPress={() =>
          socketRef.current.emit('save-score', {
            roomId, //roomId
            score: 20,
          })
        }>
        <Text>Answer</Text>
      </Button>
      {countdown !== null && <Text>Time left: {countdown} seconds</Text>}
      {isShowAnswer && <Text>Answer: {currentQA?.options[currentQA.answer - 1]}</Text>}
    </View>
  );
}
