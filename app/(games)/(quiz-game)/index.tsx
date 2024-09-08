import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Image, Pressable, SafeAreaView, Text, View } from 'react-native';
import io from 'socket.io-client';
import { Colors } from '~/constants/Colors';

import { fetchQuizGameQAs } from '~/lib/api/api';
import { IQA } from '~/lib/interfaces';
import useQuizGameStore from '~/stores/quizGame';

const instruction =
  "Please wait for other players to join the game. Once the game starts, you'll be asked a series of questions. Answer them correctly to earn points. Good luck!";

export default function QuizGameRoom() {
  const { token } = useLocalSearchParams();
  const [countdown, setCountdown] = useState<number>(0);
  const [selectedBox, setSelectedBox] = useState<number | null>(null);
  const [showScore, setShowScore] = useState<boolean>(false);
  const {
    isPlay,
    isWaiting,
    isFinish,
    numPlayers,
    currentQuestion,
    questionIndex,
    userAnswer,
    isShowAnswer,
    score,
    setIsPlay,
    setIsWaiting,
    setIsFinish,
    setNumPlayers,
    setCurrentQuestion,
    setQuestionIndex,
    setUserAnswer,
    setIsCorrect,
    setIsShowAnswer,
    incrementScore,
    resetGame,
  } = useQuizGameStore();
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const listQuestionRef = useRef<IQA[]>([]);

  const { data, isPending } = useQuery({
    queryKey: ['quiz-game-qas', '66dc3bbc35e82d9181525308'], //roomId
    queryFn: fetchQuizGameQAs,
  });

  useEffect(() => {
    if (isPending) {
      return;
    }
    listQuestionRef.current = data || [];
  }, [data]);

  useEffect(() => {
    const socket = io(`ws://146.190.100.11:3000/quiz-game`, {
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
      query: {
        roomId: '66dc3bbc35e82d9181525308', //roomId
      },
    });
    socket.on('connect', () => {
      console.log('connected');
      resetGame();
    });

    socket.on('waiting-players', (data: { message: string }) => {
      setIsWaiting(true);
    });

    socket.on('player-joined', (data: { message: string }) => {
      setNumPlayers((current: number) => current + 1);
    });

    socket.on('game-start', () => {
      setIsPlay(true);
      setIsWaiting(false);
    });

    socket.on('start-question', (data: { noQa: number }) => {
      setIsShowAnswer(false);
      setQuestionIndex(data.noQa);
      setCurrentQuestion(listQuestionRef.current[data.noQa]);
      startCountdown(10); // Start countdown when question starts
    });

    socket.on('answer-question', (data: { message: string }) => {
      startCountdown(10); // Start countdown when answer is shown
    });

    socket.on('show-answer', (data: { message: string }) => {
      handleSave();
      startCountdown(10); // Start countdown when answer is shown
      setIsShowAnswer(true);
    });

    return () => {
      socket.removeAllListeners('connect');
      socket.removeAllListeners('waiting-players');
      socket.removeAllListeners('player-joined');
      socket.removeAllListeners('game-start');
      socket.removeAllListeners('start-question');
      socket.removeAllListeners('answer-question');
      socket.removeAllListeners('show-answer');
      socket.disconnect();
    };
  }, [token]);

  const toggleColor = (index: number | null) => {
    if (index === null) return;
    setSelectedBox(index);
    setUserAnswer(index);
  };

  const handleSave = () => {
    const correctAnswer = useQuizGameStore.getState().currentQuestion?.answer;
    const chosenAnswer = useQuizGameStore.getState().userAnswer;
    if (correctAnswer && chosenAnswer && correctAnswer === chosenAnswer + 1) {
      incrementScore();
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }

    const nextQuestionIndex = useQuizGameStore.getState().questionIndex + 1;
    if (nextQuestionIndex < listQuestionRef.current.length) {
      setSelectedBox(null);
    } else {
      setIsFinish(true);
    }
  };

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
          if (useQuizGameStore.getState().isFinish) {
            setShowScore(true);
          }
          return 0;
        } else {
          return current - 1;
        }
      });
    }, 1000);
  };

  return (
    <SafeAreaView className='flex-1 bg-purple-100'>
      {isWaiting ? (
        <View className='px-6 py-10'>
          <Text className='text-lg mb-3 font-bold'>Instruction</Text>
          <Text>{instruction}</Text>
        </View>
      ) : (
        <View className='flex flex-1 bg-purple-100 px-6 py-10'>
          {isFinish && showScore ? (
            <View className='flex flex-1'>
              <View className='flex-1 flex items-center justify-center gap-6'>
                <Text className='text-4xl font-bold'>Quiz Completed</Text>
                <View className='bg-primary w-full py-16 rounded-xl p-4 flex items-center justify-center'>
                  <Text className='font-bold text-white text-2xl'>You scored {score} points!</Text>
                </View>
                <View className='w-full items-center justify-center gap-6 rounded-3xl bg-white px-5 py-10 border'>
                  <Text className='text-2xl font-semibold'>You win a prize!</Text>
                  <Image className='w-40 h-40' source={{ uri: 'https://picsum.photos/id/237/200/200' }} />
                  <Text className='text-xl font-semibold'>Voucher</Text>
                </View>
              </View>
              <Pressable
                className='bg-primary p-4 rounded-xl w-fit self-center items-center'
                onPress={() => {
                  resetGame();
                  router.push({ pathname: '/leaderboard' });
                }}>
                <Text className='text-white font-bold text-lg'>View Leaderboard</Text>
              </Pressable>
            </View>
          ) : (
            isPlay &&
            currentQuestion && (
              <View>
                <View>
                  <View className='w-full flex items-center flex-row justify-between mb-6'>
                    <View className='flex items-center'>
                      <Ionicons name='person' size={24} color={Colors.light.tint} className='mb-1' />
                      <Text className='font-bold text-xl'>{numPlayers < 10 ? `0${numPlayers}` : numPlayers}</Text>
                    </View>

                    <View className='flex items-center'>
                      <Text className='font-bold text-primary text-lg'>Questions</Text>
                      <Text className='text-gray-500 text-lg'>
                        {questionIndex + 1}/{listQuestionRef.current.length}
                      </Text>
                    </View>

                    <View className='flex items-center'>
                      <Ionicons name='time' size={24} color={Colors.light.tint} className='mb-1' />
                      {countdown !== null && (
                        <Text className='font-bold text-xl'>{countdown < 10 ? `0${countdown}` : countdown}</Text>
                      )}
                    </View>
                  </View>

                  <View className='w-full bg-primary py-4 h-56 rounded-2xl flex items-center justify-center px-2 mb-8'>
                    <Text className='text-2xl text-secondary text-center font-bold'>{currentQuestion?.question}</Text>
                  </View>

                  <Text className='text-lg mb-3 font-bold'>Select your answer</Text>
                  <View className='flex items-center mb-4'>
                    {currentQuestion !== null &&
                      currentQuestion?.options.map((option, index) => (
                        <Pressable
                          className={`w-full py-6 px-4 rounded-2xl mb-3 font-bold 
                  ${
                    selectedBox === index
                      ? 'bg-primary border-[1px] border-primary'
                      : 'bg-background border-[1px] border-primary'
                  }`}
                          key={index}
                          onPress={() => toggleColor(index)}
                          disabled={isShowAnswer}
                          style={
                            isShowAnswer && currentQuestion.answer === index + 1
                              ? { backgroundColor: 'rgb(187 247 208)' }
                              : isShowAnswer && userAnswer === index && currentQuestion.answer !== index + 1
                                ? { backgroundColor: 'rgb(254 202 202)' }
                                : {}
                          }>
                          <Text
                            className={`font-bold text-xl text-center ${selectedBox === index && !isShowAnswer ? 'text-white' : 'text-foreground'}`}>
                            {option}
                          </Text>
                        </Pressable>
                      ))}
                  </View>
                </View>
              </View>
            )
          )}
        </View>
      )}
    </SafeAreaView>
  );
}
