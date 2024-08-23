import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { FlatList, Pressable, RefreshControl, SafeAreaView, Text, View } from 'react-native';

import EventCard from '~/components/EventCard';
import { Skeleton } from '~/components/ui/skeleton';
import { useRefreshByUser } from '~/hooks/useRefreshByUser';
import { fetchFavoriteEvents } from '~/lib/api/api';

export default function FavoriteEvents() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['favoriteEvents'],
    queryFn: fetchFavoriteEvents,
  });
  const { isRefetchingByUser, refetchByUser } = useRefreshByUser(refetch);

  if (isLoading) {
    return (
      <View className='aspect-video h-auto w-full items-center'>
        <Skeleton className='mb-4 h-24 w-[368px]' />
        <Skeleton className='mb-4 h-24 w-[368px]' />
        <Skeleton className='mb-4 h-24 w-[368px]' />
        <Skeleton className='mb-4 h-24 w-[368px]' />
        <Skeleton className='mb-4 h-24 w-[368px]' />
      </View>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <SafeAreaView className='m-6 h-full gap-4'>
      <View className='flex-1 gap-4'>
        <FlatList
          data={data.favoriteEvents}
          renderItem={({ item }) => (
            <Pressable
              onPress={() =>
                router.push({
                  pathname: `/favorite-event-details/[id]`,
                  params: { id: item.id },
                })
              }>
              <EventCard
                id={item.id}
                name={item.name}
                brand_name={item.brandInfo.name}
                begin_date={item.beginDate}
                end_date={item.endDate}
                image={item.images[0]}
              />
            </Pressable>
          )}
          ItemSeparatorComponent={() => <View className='h-4' />}
          keyExtractor={(item) => item.id}
          refreshControl={<RefreshControl refreshing={isRefetchingByUser} onRefresh={refetchByUser} />}
          // onEndReached={onEndReached}
          // refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={<Text>No events found</Text>}
          // ListFooterComponent={<View>{isFetchingNextPage && <ActivityIndicator />}</View>}
        />
      </View>
    </SafeAreaView>
  );
}
