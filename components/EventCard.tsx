import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, Image, ImageBackground, View } from 'react-native';

import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import { getEventDateInfo } from '~/utils/DateTimeUtils';

import useFileQuery from '~/hooks/useFileQuery';
import { LoadingIndicator } from './LoadingIndicator';

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
  const { imageUri, isLoading } = useFileQuery(image);

  const { beginDate, endDate } = getEventDateInfo(begin_date, end_date);

  if (isLoading) {
    return (
      <Card className={horizontal ? 'aspect-square h-56' : 'h-36'}>
        <LoadingIndicator />
      </Card>
    );
  }

  return (
    <Card className={horizontal ? 'aspect-square h-56' : 'h-36'}>
      <View className='h-full'>
        {horizontal ? (
          isLoading ? (
            <ActivityIndicator />
          ) : (
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
          )
        ) : (
          <View className='flex h-full w-full flex-row items-center'>
            <View>
              {isLoading ? (
                <ActivityIndicator />
              ) : (
                <Image className='aspect-square h-full w-full rounded-l-lg object-cover' source={{ uri: imageUri }} />
              )}
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
      </View>
    </Card>
  );
}
