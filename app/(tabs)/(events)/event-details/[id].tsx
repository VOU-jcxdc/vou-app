import Ionicons from '@expo/vector-icons/Ionicons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, FlatList, Image, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';

import VoucherCard from '~/components/VoucherCard';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import {
  addFavoriteEvent,
  fetchConfigs,
  fetchEvent,
  fetchEventVouchers,
  fetchFile,
  removeFavoriteEvent,
} from '~/lib/api/api';
import { SHAKE_GAME_ID } from '~/lib/constants';
import { getEventDateInfo } from '~/utils/DateTimeUtils';

const apiURl = process.env.EXPO_PUBLIC_API_URL;

export default function EventDetails() {
  const { id, favorite } = useLocalSearchParams();
  const [isFavorite, setIsFavorite] = useState(favorite || false);
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['event', id as string],
    queryFn: fetchEvent,
  });
  const configs = useQuery({
    queryKey: ['configs', id as string],
    queryFn: fetchConfigs,
  });

  const { data: eventImage } = useQuery({
    queryKey: ['file', data?.images[0] || ''],
    queryFn: () => fetchFile,
    enabled: !!data,
  });

  const addFavoriteEventMutation = useMutation({
    mutationFn: addFavoriteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['favoriteEvents'] });
      Toast.show({
        type: 'success',
        text1: 'Add to favorite',
        visibilityTime: 1000,
      });
      setIsFavorite(true);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const removeFavoriteEventMutation = useMutation({
    mutationFn: removeFavoriteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['favoriteEvents'] });
      Toast.show({
        type: 'success',
        text1: 'Remove from favorite',
        visibilityTime: 1000,
      });
      setIsFavorite(false);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const { data: eventVouchers } = useQuery({
    queryKey: ['event-vouchers', id as string],
    queryFn: fetchEventVouchers,
    enabled: !!data,
  });

  if (!data) {
    return null;
  }

  if (isLoading || configs.isLoading) {
    return (
      <View className='aspect-video h-auto w-full items-center'>
        <ActivityIndicator />
      </View>
    );
  }

  const { beginDate, endDate, beginTimestamp, endTimestamp, isCurrent } = getEventDateInfo(
    data.beginDate,
    data.endDate
  );

  const handleFavorite = () => {
    if (isFavorite) {
      removeFavoriteEventMutation.mutate({ eventId: data.id });
    } else {
      addFavoriteEventMutation.mutate({ eventId: data.id });
    }
  };

  return (
    <View className='flex-1 gap-4'>
      <FlatList
        ListHeaderComponent={
          <>
            <View className='aspect-video'>
              <Image
                className='h-full w-full object-cover'
                source={{
                  uri: eventImage ? `${apiURl}/files/${data.images[0]}` : 'https://picsum.photos/id/1/200/300',
                }}
              />
            </View>
            <View className='gap-3 m-4'>
              <View className='flex flex-row items-center justify-between'>
                <View className='gap-2'>
                  <Badge className={isCurrent ? 'bg-green-200' : 'bg-slate-200'}>
                    <Text className={isCurrent ? 'text-green-600' : 'text-secondary-foreground'}>
                      {isCurrent ? 'Happening event' : 'In-coming event'}
                    </Text>
                  </Badge>
                  <Text>
                    {beginDate} - {endDate}
                  </Text>
                </View>
                <View className='flex flex-row gap-2'>
                  <Button variant='outline' size='icon' className='h-12 w-12 rounded-full' onPress={handleFavorite}>
                    <Ionicons
                      name={isFavorite ? 'heart' : 'heart-outline'}
                      size={24}
                      color={isFavorite ? 'red' : 'black'}
                    />
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
                  From {beginTimestamp + ' ' + beginDate} to {endTimestamp + ' ' + endDate}
                </Text>
              </View>
              {eventVouchers && eventVouchers.length > 0 && (
                <View className='gap-2'>
                  <Text className='text-xl font-bold'>Rewards</Text>
                </View>
              )}
            </View>
          </>
        }
        data={eventVouchers}
        renderItem={({ item }) => {
          const { voucher } = item;
          return (
            <View className='mx-4'>
              <VoucherCard
                id={voucher.id}
                name={voucher.name}
                description={voucher.description}
                code={voucher.code}
                brandInfo={{ name: data.brandInfo.name, bucketId: data.brandInfo.bucketId }}
                duration={voucher.duration}
                usageMode={voucher.usageMode}
                isAssigned={false}
                quantity={item.quantity}
              />
            </View>
          );
        }}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View className='h-4' />}
        ListFooterComponent={
          <View className='w-full px-4 py-4'>
            <Button
              className='rounded bg-primary'
              disabled={data?.gameId === null}
              onPress={() => {
                data?.gameId === SHAKE_GAME_ID
                  ? router.push({
                      pathname: '/(shake-game)',
                      params: { eventId: id, configs: (configs.data?.eventConfig as number) || 0 },
                    })
                  : router.push({
                      pathname: '/(quiz-game)',
                      params: { eventId: id, configs: (configs.data?.eventConfig as number) || 0 },
                    });
              }}>
              <Text className='font-bold text-primary-foreground'>PLAY NOW</Text>
            </Button>
          </View>
        }
      />
      <Toast />
    </View>
  );
}
