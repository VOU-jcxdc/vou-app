import { router } from 'expo-router';
import { Image, ImageBackground, Pressable, View } from 'react-native';

import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui/card';
import { Text } from '~/components/ui/text';

type EventCardProps = {
  id: string;
  name: string;
  brand_name: string;
  begin_date: string;
  end_date: string;
  image: string;
  horizontal?: boolean;
  page?: string;
};

export default function EventCard({
  id,
  name,
  brand_name,
  begin_date,
  end_date,
  image,
  horizontal = false,
  page = 'events',
}: EventCardProps) {
  const beginDate = new Date(begin_date).toLocaleDateString();
  const endDate = new Date(end_date).toLocaleDateString();

  return (
    <Card className={horizontal ? 'aspect-square h-56' : 'h-36'}>
      <Pressable
        className='h-full'
        onPress={() =>
          router.push({
            pathname: `/(${page})/[id]`,
            params: { id },
          })
        }>
        {horizontal ? (
          <ImageBackground
            className='h-full w-full justify-end object-cover'
            imageStyle={{ borderRadius: 5 }}
            source={{ uri: image }}>
            <CardHeader className='px-3 py-0'>
              <CardDescription className='pb-1 font-semibold text-background'>{brand_name}</CardDescription>
              <CardTitle className='pb-0.5 text-background'>{name}</CardTitle>
            </CardHeader>
            <CardFooter className='px-3 pb-3'>
              <Text className='font-semibold text-background'>
                {beginDate} - {endDate}
              </Text>
            </CardFooter>
          </ImageBackground>
        ) : (
          <View className='flex h-full w-full flex-row'>
            <View>
              <Image className='aspect-square h-full w-full rounded-l-lg object-cover' source={{ uri: image }} />
            </View>
            <View className='mt-3.5 w-72'>
              <CardHeader className='px-3 py-0'>
                <CardDescription className='pb-1 font-semibold'>{brand_name}</CardDescription>
                <CardTitle className='pb-0.5'>{name}</CardTitle>
              </CardHeader>
              <CardFooter className='px-3 pb-3'>
                <Text className='font-semibold'>
                  {beginDate} - {endDate}
                </Text>
              </CardFooter>
            </View>
          </View>
        )}
      </Pressable>
    </Card>
  );
}
