import { Image, Text, View } from 'react-native';

type PlayerProps = {
  name: string;
  image: string;
  score?: number;
};

export default function Player({ name, image, score }: PlayerProps) {
  return (
    <View className='w-full h-24 bg-background rounded-lg'>
      <View className='flex h-full w-full flex-row items-center justify-between px-4'>
        <View className='flex-row items-center gap-4'>
          <Image className='rounded-full h-16 w-16' source={{ uri: image }} />
          <Text className='pb-0.5 text-xl font-semibold'>{name}</Text>
        </View>
        <View>
          <Text className='text-2xl font-semibold'>{score}</Text>
        </View>
      </View>
    </View>
  );
}
