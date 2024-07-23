import { Text, View } from 'react-native';

import { Button } from '~/components/ui/button';
import useGameStore from '~/stores/game';

export default function Index() {
  const { isPlay, setIsPlay } = useGameStore();
  return (
    <View className='m-auto flex-col justify-around'>
      <Text className='text-center text-red-500 font-bold'>Hehe, setup xong r ne!</Text>
      <Button variant='outline' onPress={() => setIsPlay(!isPlay)}>
        <Text>Simple Button using RNR</Text>
        <Text>{isPlay ? 'Playing' : 'Not Playing'}</Text>
      </Button>
    </View>
  );
}
