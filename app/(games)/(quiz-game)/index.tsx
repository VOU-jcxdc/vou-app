import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import _ from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { FlatList, Pressable, SafeAreaView, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';
import io from 'socket.io-client';
import Player from '~/components/Player';
import { Colors } from '~/constants/Colors';
import { fetchQuizGameQAs, fetchRoomGame } from '~/lib/api/api';
import { IQA } from '~/lib/interfaces';
import useQuizGameStore from '~/stores/quizGame';

const instruction =
  'Objective: Answer as many questions correctly within the given time limit.\nGameplay:\n1. Players join the game and wait for the quiz to start.\n2. Questions are displayed one at a time, and players must select the correct answer from multiple choices.\n3. Points are awarded for each correct answer, and the faster the response, the more points are earned.\n4. The game continues until the time limit is reached or all questions are answered.\n5. The player with the highest score at the end of the game wins.\nRules:\n1. No cheating or using external help.\n2. Players must answer within the time limit for each question.';

interface Player {
  score: number;
  player: {
    userId: string;
    username: string;
    bucketId: string;
  };
}

export default function QuizGameRoom() {
  const { eventId, gameId, token } = useLocalSearchParams();
  const [countdown, setCountdown] = useState<number>(0);
  const [selectedBox, setSelectedBox] = useState<number | null>(null);
  const [showScore, setShowScore] = useState<boolean>(false);
  const [players, setPlayers] = useState<Player[]>([]);
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
  const socketRef = useRef(io(''));

  const gameInfo = useQuery({
    queryKey: ['room-game', eventId as string, gameId as string],
    queryFn: fetchRoomGame,
  });

  const roomId = gameInfo.data?.roomGame?.id;

  const { data, isPending } = useQuery({
    queryKey: ['quiz-game-qas', roomId],
    queryFn: fetchQuizGameQAs,
    enabled: !!roomId,
  });

  useEffect(() => {
    if (isPending) {
      return;
    }
    listQuestionRef.current = data || [];
  }, [data]);

  useEffect(() => {
    if (!roomId) return;
    const socket = io(`ws://146.190.100.11:3000/quiz-game`, {
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
      query: {
        roomId,
      },
      transports: ['websocket'],
    });

    socketRef.current = socket;
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

    socket.on('start-question', (data: { noQa: number }) => {
      setIsWaiting(false);
      setIsPlay(true);
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

    socket.on('game-finished', (data: { message: string; playersRank: Player[] }) => {
      setIsFinish(true);
      setPlayers(data.playersRank);
    });

    socket.on('you-win', (data: { message: string }) => {
      Toast.show({
        type: 'info',
        text1: data.message,
      });
    });

    return () => {
      socket.off('connect');
      socket.off('waiting-players');
      socket.off('player-joined');
      socket.off('game-start');
      socket.off('start-question');
      socket.off('answer-question');
      socket.off('show-answer');
      socket.off('game-finished');
      socket.off('you-win');
      socket.disconnect();
    };
  }, [token, roomId]);

  const toggleColor = (index: number | null) => {
    if (index === null) return;
    setSelectedBox(index);
    setUserAnswer(index);
  };

  const handleSave = () => {
    const correctAnswer = useQuizGameStore.getState().currentQuestion?.answer;
    const chosenAnswer = useQuizGameStore.getState().userAnswer;
    if (!_.isNil(correctAnswer) && !_.isNil(chosenAnswer) && correctAnswer === chosenAnswer + 1) {
      incrementScore();
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }

    const nextQuestionIndex = useQuizGameStore.getState().questionIndex + 1;
    if (nextQuestionIndex < listQuestionRef.current.length) {
      setSelectedBox(null);
    }
  };

  const startCountdown = (timeLeft: number) => {
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
        <View className='px-6 py-10 flex flex-1 justify-between'>
          <View>
            <Text className='text-2xl mb-3 font-bold'>Quiz Game Instruction</Text>
            <Text className='text-lg'>{instruction}</Text>
          </View>
          <View className='bg-primary w-full py-6 rounded-xl p-4 flex items-center justify-center'>
            <Text className='font-bold text-white text-xl'>Waiting for other players...</Text>
          </View>
        </View>
      ) : (
        <View className='flex flex-1 bg-purple-100 px-6 py-10'>
          {isFinish && showScore ? (
            <View className='flex flex-1 gap-6 bg-purple-100 px-6 py-12'>
              <Text className='text-2xl font-bold text-center'>Leaderboard</Text>
              <FlatList
                className='w-full'
                data={players}
                renderItem={({ item }) => (
                  <Player name={item.player.username} image={item.player.bucketId} score={item.score} />
                )}
                keyExtractor={(item) => item.player.userId}
                ItemSeparatorComponent={() => <View className='h-4' />}
              />
              <Pressable
                className='bg-primary p-4 rounded-xl w-fit flex-row self-center gap-4'
                onPress={() => {
                  resetGame();
                  router.push({
                    pathname: '/(events)',
                  });
                }}>
                <Ionicons name='home' size={24} color='white' />
                <Text className='text-white font-bold text-lg'>Back To Home</Text>
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
                          onPress={() => {
                            toggleColor(index);
                            if (index === currentQuestion.answer - 1) {
                              console.log('current score', score);
                              socketRef.current.emit('save-score', {
                                roomId,
                                score: score + 20,
                              });
                            } else {
                              socketRef.current.emit('save-score', {
                                roomId,
                                score,
                              });
                            }
                          }}
                          disabled={isShowAnswer || selectedBox !== null}
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
