import { Image, View } from 'react-native';
import { Card } from './ui/card';
import { Text } from './ui/text';

const apiURl = process.env.EXPO_PUBLIC_API_URL;

type ItemCardProps = {
  id: string;
  imageId: string;
  name: string;
  originalQuantity?: number;
};

export default function ItemCard({ id, imageId, name, originalQuantity }: ItemCardProps) {
  const imageUri = imageId
    ? `${apiURl}/files/${imageId}?${new Date().getTime()}`
    : 'https://picsum.photos/id/1/200/300';

  return (
    <Card className='flex-1'>
      <View className='w-full gap-4 items-center relative'>
        {originalQuantity && (
          <View className='absolute right-0 top-2 z-30'>
            <Text className=' font-medium color-primary px-2'>x{originalQuantity}</Text>
          </View>
        )}
        <View className='h-32 w-full bg-slate-50 flex items-center justify-center gap-2'>
          <Image className='rounded-full h-12 w-12' source={{ uri: imageUri }} />
          <Text className='text-base font-semibold text-center'>{name}</Text>
        </View>
      </View>
    </Card>
  );
}
