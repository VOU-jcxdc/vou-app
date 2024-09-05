import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, SafeAreaView, Text, View } from 'react-native';

import { Colors } from '~/constants/Colors';

interface Question {
  id: number;
  category: string;
  question: string;
  answer: string;
  options: string[];
}

const questionsData: Question[] = [
  {
    id: 1,
    category: 'Geography',
    question: 'What is the capital of France?',
    answer: 'Paris',
    options: ['Paris', 'London', 'Berlin', 'Madrid'],
  },
  {
    id: 2,
    category: 'Geography',
    question: 'What is the capital of Germany?',
    answer: 'Berlin',
    options: ['Paris', 'London', 'Berlin', 'Madrid'],
  },
  {
    id: 3,
    category: 'Geography',
    question: 'What is the capital of Spain?',
    answer: 'Madrid',
    options: ['Paris', 'London', 'Berlin', 'Madrid'],
  },
];

export default function QuizGame() {
  const [count, setCount] = useState<number>(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [player, setPlayer] = useState<number>(1);
  const [time, setTime] = useState<number>(10);
  const [score, setScore] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [selectedBox, setSelectedBox] = useState<number | null>(null);

  const toggleColor = (index: number | null) => {
    if (index === null) return;
    setSelectedBox(index);
    setUserAnswer(questions[count].options[index]);
  };

  useEffect(() => {
    setQuestions(questionsData);
  }, []);

  const handleSave = () => {
    let userScore = score;
    if (questions[count].answer === userAnswer) {
      userScore += 1;
      setScore(userScore);
    }

    if (count < questions.length - 1) {
      setCount((count) => count + 1);
      setSelectedBox(null);
      setTime(10);
    } else {
      router.push({
        pathname: '/complete',
        params: { score: userScore },
      });
    }
  };

  useEffect(() => {
    if (time > 0) {
      const timer = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (time === 0) {
      handleSave();
    }
  }, [time]);

  return (
    <SafeAreaView className='flex-1 bg-background p-4 bg-purple-100'>
      <View className='w-full flex items-center flex-row justify-between mb-6'>
        <View className='flex items-center'>
          <Ionicons name='person' size={24} color={Colors.light.tint} className='mb-1' />
          <Text className='font-bold text-xl'>{player < 10 ? `0${player}` : player}</Text>
        </View>

        <View className='flex items-center'>
          <Text className='font-bold text-primary text-lg'>{questions[count]?.category}</Text>
          <Text className='text-gray-500 text-lg'>
            {count + 1}/{questions.length}
          </Text>
        </View>

        <View className='flex items-center'>
          <Ionicons name='time' size={24} color={Colors.light.tint} className='mb-1' />
          <Text className='font-bold text-xl'>{time < 10 ? `0${time}` : time}</Text>
        </View>
      </View>

      <View className='w-full bg-primary py-4 h-56 rounded-2xl flex items-center justify-center px-2 mb-8'>
        <Text className='text-2xl text-secondary text-center font-bold'>{questions[count]?.question}</Text>
      </View>

      <Text className='text-lg mb-3 font-bold'>Select your answer</Text>
      <View className='flex items-center mb-4'>
        {questions[count]?.options.map((item, index) => (
          <Pressable
            className={`w-full ${
              selectedBox === index
                ? 'bg-primary border-[1px] border-primary'
                : 'bg-background border-[1px] border-primary'
            } py-6 px-4 rounded-2xl mb-3 font-bold`}
            key={index}
            onPress={() => toggleColor(index)}>
            <Text
              className={`font-bold text-xl text-center ${selectedBox === index ? 'text-white' : 'text-foreground'}`}>
              {item}
            </Text>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}
