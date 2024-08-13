import Ionicons from '@expo/vector-icons/Ionicons';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import * as React from 'react';
import { Image, ScrollView, Text, View } from 'react-native';

import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Skeleton } from '~/components/ui/skeleton';
import { fetchEvent, fetchFile } from '~/lib/api/api';
import { getEventDateInfo } from '~/utils/DateTimeUtils';

const apiURl = process.env.EXPO_PUBLIC_API_URL;

export default function EventDetails() {
  const [isFavorite, setIsFavorite] = React.useState(false);
  const { id } = useLocalSearchParams();
  const { data, isLoading } = useQuery({
    queryKey: ['event', id as string],
    queryFn: fetchEvent,
  });

  if (!data) {
    return null;
  }

  const { data: eventImage } = useQuery({
    queryKey: ['file', data.images[0]],
    queryFn: fetchFile,
  });

  if (isLoading) {
    return (
      <View className='aspect-video h-auto w-full items-center'>
        <Skeleton className='mb-4 h-full w-full' />
        <Skeleton className='mb-4 h-12 w-[368px]' />
        <Skeleton className='mb-4 h-16 w-[368px]' />
        <Skeleton className='mb-4 h-40 w-[368px]' />
        <Skeleton className='h-screen w-[368px]' />
      </View>
    );
  }

  const { beginDate, endDate, isCurrent } = getEventDateInfo(data.beginDate, data.endDate);

  const handleShare = () => {
    alert('Share event');
  };

  const handleFavorite = () => {
    if (isFavorite) {
      // Remove from favorite
    } else {
      // Save to favorite
      alert('Add to favorite');
    }

    setIsFavorite(!isFavorite);
  };

  return (
    <View className='flex-1 gap-4'>
      <ScrollView>
        <View className='aspect-video'>
          <Image
            className='h-full w-full object-cover'
            source={{
              uri: eventImage ? `${apiURl}/files/${data.images[0]}` : 'https://picsum.photos/id/1/200/300',
            }}
          />
        </View>
        <View className='gap-3 p-5'>
          <View className='flex flex-row items-center justify-between'>
            <View className='gap-2'>
              <Badge className={isCurrent ? 'bg-green-200' : 'bg-slate-200'}>
                <Text className={isCurrent ? 'text-green-600' : 'text-primary'}>
                  {isCurrent ? 'Happening event' : 'In-coming event'}
                </Text>
              </Badge>
              <Text>
                {beginDate} - {endDate}
              </Text>
            </View>
            <View className='flex flex-row gap-2'>
              <Button variant='outline' size='icon' className='h-12 w-12 rounded-full' onPress={handleShare}>
                <Ionicons name='share-social-outline' size={24} />
              </Button>
              <Button variant='outline' size='icon' className='h-12 w-12 rounded-full' onPress={handleFavorite}>
                <Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={24} />
              </Button>
            </View>
          </View>
          <View className='gap-3'>
            <Text className='text-3xl font-bold'>{data?.name}</Text>
            <Text>{data?.description}</Text>
          </View>
          <View className='gap-2'>
            <Text className='text-xl font-bold'>Event Time</Text>
            <Text>
              From {beginDate} to {endDate}
            </Text>
          </View>
          <View className='gap-2'>
            <Text className='text-xl font-bold'>Instruction</Text>
            <Text>{data?.description}</Text>
          </View>
        </View>
      </ScrollView>
      <View className='w-full p-5'>
        <Button className='rounded bg-primary' onPress={() => alert('Play Game')}>
          <Text className='font-bold text-primary-foreground'>PLAY NOW</Text>
        </Button>
      </View>
    </View>
  );
}
