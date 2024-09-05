import { router } from 'expo-router';
import { FlatList, SafeAreaView, Text, View } from 'react-native';

import Player from '~/components/Player';
import { Button } from '~/components/ui/button';

const players = [
  {
    id: '1',
    name: 'John Doe',
    image: 'https://picsum.photos/id/237/200/200',
  },
  {
    id: '2',
    name: 'Jane Doe',
    image: 'https://picsum.photos/id/237/200/200',
  },
  {
    id: '3',
    name: 'John Doe',
    image: 'https://picsum.photos/id/237/200/200',
  },
  {
    id: '4',
    name: 'Jane Doe',
    image: 'https://picsum.photos/id/237/200/200',
  },
  {
    id: '5',
    name: 'John Doe',
    image: 'https://picsum.photos/id/237/200/200',
  },
  {
    id: '6',
    name: 'Jane Doe',
    image: 'https://picsum.photos/id/237/200/200',
  },
  {
    id: '7',
    name: 'John Doe',
    image: 'https://picsum.photos/id/237/200/200',
  },
  {
    id: '8',
    name: 'Jane Doe',
    image: 'https://picsum.photos/id/237/200/200',
  },
  {
    id: '9',
    name: 'John Doe',
    image: 'https://picsum.photos/id/237/200/200',
  },
  {
    id: '10',
    name: 'Jane Doe',
    image: 'https://picsum.photos/id/237/200/200',
  },
  {
    id: '11',
    name: 'John Doe',
    image: 'https://picsum.photos/id/237/200/200',
  },
  {
    id: '12',
    name: 'Jane Doe',
    image: 'https://picsum.photos/id/237/200/200',
  },
  {
    id: '13',
    name: 'John Doe',
    image: 'https://picsum.photos/id/237/200/200',
  },
  {
    id: '14',
    name: 'Jane Doe',
    image: 'https://picsum.photos/id/237/200/200',
  },
  {
    id: '15',
    name: 'John Doe',
    image: 'https://picsum.photos/id/237/200/200',
  },
];

export default function QuizGameWaitRoom() {
  // useEffect(() => {
  //   setTimeout(() => {
  //     router.push({
  //       pathname: '/play',
  //     });
  //   }, 10000);
  // });

  return (
    <SafeAreaView className='flex flex-1 bg-purple-100 px-6 py-10'>
      <View className='flex-1 flex gap-6 items-center'>
        <View className='bg-primary w-full rounded-xl p-4 flex items-center justify-center'>
          <Text className='font-bold text-white text-xl'>Waiting for players to join</Text>
        </View>

        <FlatList
          className='w-full'
          data={players}
          renderItem={({ item }) => <Player name={item.name} image={item.image} />}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View className='h-4' />}
        />

        {/* Testing button */}
        <Button
          onPress={() => {
            router.push({
              pathname: '/play',
            });
          }}>
          <Text className='text-white font-bold text-lg'>Start Game</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
