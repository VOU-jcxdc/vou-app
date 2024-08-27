import { router } from 'expo-router';
import { ActivityIndicator, FlatList, Pressable, RefreshControl, SafeAreaView, View } from 'react-native';
import EventCard from '~/components/EventCard';

import { Skeleton } from '~/components/ui/skeleton';
import { Text } from '~/components/ui/text';
import { useInfiniteScroll } from '~/hooks/useInfiniteScroll';
import { fetchFavoriteEvents } from '~/lib/api/api';
import { FavoriteEventsResponse } from '~/lib/interfaces';

export default function FavoriteEvents() {
  const { data, isLoading, isRefreshing, onRefresh, onEndReached, isFetchingNextPage } =
    useInfiniteScroll<FavoriteEventsResponse>({
      key: 'favoriteEvents',
      fetcher: fetchFavoriteEvents,
    });

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
          data={data}
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
          onEndReached={onEndReached}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={<Text>No events found</Text>}
          ListFooterComponent={<View>{isFetchingNextPage && <ActivityIndicator />}</View>}
        />
      </View>
    </SafeAreaView>
  );
}
