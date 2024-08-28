import { Image, View } from 'react-native';

import { Card } from '~/components/ui/card';
import { Text } from '~/components/ui/text';

type ItemCardProps = {
  id: string;
  name: string;
  image: string;
};

export default function ItemCard({ id, name, image }: ItemCardProps) {
  return (
    <Card className='aspect-square h-48 mr-6'>
      <View className='h-full w-full justify-center items-center'>
        <View>
          <Image className='aspect-square w-24 h-24' source={{ uri: image }} />
        </View>
        <Text className='font-semibold text-md'>{name}</Text>
        <Text className='font-semibold text-xl'>1/1</Text>
      </View>
    </Card>
  );
}
