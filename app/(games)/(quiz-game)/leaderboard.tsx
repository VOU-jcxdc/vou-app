import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { FlatList, Pressable, SafeAreaView, Text, View } from 'react-native';
import Player from '~/components/Player';

const players = [
  {
    id: '1',
    name: 'John Doe',
    image: 'https://picsum.photos/id/237/200/200',
    score: 100,
  },
  {
    id: '2',
    name: 'Jane Doe',
    image: 'https://picsum.photos/id/237/200/200',
    score: 100,
  },
  {
    id: '3',
    name: 'John Doe',
    image: 'https://picsum.photos/id/237/200/200',
    score: 100,
  },
  {
    id: '4',
    name: 'Jane Doe',
    image: 'https://picsum.photos/id/237/200/200',
    score: 100,
  },
  {
    id: '5',
    name: 'John Doe',
    image: 'https://picsum.photos/id/237/200/200',
    score: 100,
  },
];

export default function LeaderboardScreen() {
  return (
    <SafeAreaView className='flex flex-1 gap-6 bg-purple-100 px-6 py-12'>
      <Text className='text-2xl font-bold text-center'>Leaderboard</Text>

      <FlatList
        className='w-full'
        data={players}
        renderItem={({ item }) => <Player name={item.name} image={item.image} score={item.score} />}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View className='h-4' />}
      />

      <Pressable
        className='bg-primary p-4 rounded-xl w-fit flex-row self-center gap-4'
        onPress={() =>
          router.push({
            pathname: '/(events)',
          })
        }>
        <Ionicons name='home' size={24} color='white' />
        <Text className='text-white font-bold text-lg'>Back To Home</Text>
      </Pressable>
    </SafeAreaView>
  );
}
