import { useQuery } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Image, ImageBackground, Pressable, View } from 'react-native';

import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import { fetchFile } from '~/lib/api/api';
import { LoadingIndicator } from './LoadingIndicator';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

type EventCardProps = {
  id: string;
  name: string;
  brand_name: string;
  begin_date: Date;
  end_date: Date;
  image: string;
  horizontal?: boolean;
};

export default function EventCard({
  id,
  name,
  brand_name,
  begin_date,
  end_date,
  image,
  horizontal = false,
}: EventCardProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['file', image],
    queryFn: fetchFile,
  });

  const beginDate = new Date(begin_date).toLocaleDateString();
  const endDate = new Date(end_date).toLocaleDateString();

  if (isLoading) {
    return (
      <Card className={horizontal ? 'aspect-square h-56' : 'h-36'}>
        <LoadingIndicator />
      </Card>
    );
  }

  const imageUri = data ? `${apiUrl}/files/${image}` : 'https://picsum.photos/id/1/200/300';

  return (
    <Card className={horizontal ? 'aspect-square h-56' : 'h-36'}>
      <Pressable
        className='h-full'
        onPress={() =>
          router.push({
            pathname: `/[id]`,
            params: { id },
          })
        }>
        {horizontal ? (
          <ImageBackground
            className='h-full w-full justify-end object-cover'
            imageStyle={{
              borderRadius: 5,
            }}
            source={{ uri: imageUri }}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0)', 'rgba(0, 0, 0, 0.75)']}
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                borderRadius: 5,
              }}
            />
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
              <Image className='aspect-square h-full w-full rounded-l-lg object-cover' source={{ uri: imageUri }} />
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
