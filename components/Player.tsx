import { ActivityIndicator, Image, Text, View } from 'react-native';
import useFileQuery from '~/hooks/useFileQuery';

type PlayerProps = {
  name: string;
  image: string;
  score?: number;
};

export default function Player({ name, image, score }: PlayerProps) {
  const { imageUri, isLoading } = useFileQuery(image);

  return (
    <View className='w-full h-24 bg-background rounded-lg'>
      <View className='flex h-full w-full flex-row items-center justify-between px-4'>
        <View className='flex-row items-center gap-4'>
          {isLoading ? <ActivityIndicator /> : <Image className='rounded-full h-12 w-12' source={{ uri: imageUri }} />}
          <Text className='pb-0.5 text-xl font-semibold'>{name}</Text>
        </View>
        <View>
          <Text className='text-2xl font-semibold'>{score}</Text>
        </View>
      </View>
    </View>
  );
}
