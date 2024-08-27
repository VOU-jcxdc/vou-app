import { router } from 'expo-router';
import React from 'react';
import { ActivityIndicator, FlatList, Pressable, RefreshControl, SafeAreaView, Text, View } from 'react-native';

import EventCard from '~/components/EventCard';
import { Skeleton } from '~/components/ui/skeleton';
import { useInfiniteScroll } from '~/hooks/useInfiniteScroll';
import { fetchEvents } from '~/lib/api/api';
import { EventsResponse } from '~/lib/interfaces';
import { getEventDateInfo } from '~/utils/DateTimeUtils';

export default function Events() {
  const { data, isLoading, isRefreshing, onRefresh, onEndReached, isFetchingNextPage } =
    useInfiniteScroll<EventsResponse>({
      fetcher: fetchEvents,
      key: 'events',
    });

  if (isLoading) {
    return (
      <View className='aspect-video h-auto w-full items-center'>
        <Skeleton className='mb-4 h-64 w-[372px]' />
        <Skeleton className='h-screen w-[372px]' />
      </View>
    );
  }

  if (!data) {
    return null;
  }

  const eventsData = data.reduce(
    (acc, event) => {
      const { isCurrent } = getEventDateInfo(event.beginDate, event.endDate);
      acc[isCurrent ? 0 : 1].push(event);
      return acc;
    },
    [[], []]
  );

  return (
    <SafeAreaView className='m-6 h-full gap-4'>
      <View className='gap-4'>
        <Text className='text-xl font-bold'>Current Events</Text>
        <FlatList
          data={eventsData[0]}
          renderItem={({ item }) => (
            <Pressable
              onPress={() =>
                router.push({
                  pathname: `/event-details/[id]`,
                  params: { id: item.id, favorite: item.favorite },
                })
              }>
              <EventCard
                id={item.id}
                name={item.name}
                brand_name={item.brandInfo.name}
                begin_date={item.beginDate}
                end_date={item.endDate}
                image={item.images[0]}
                horizontal={true}
              />
            </Pressable>
          )}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View className='w-4' />}
          onEndReached={onEndReached}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={<Text>No events found</Text>}
          ListFooterComponent={<View>{isFetchingNextPage && <ActivityIndicator />}</View>}
          horizontal
        />
      </View>
      <View className='flex-1 gap-4'>
        <Text className='text-xl font-bold'>In-coming Events</Text>
        <FlatList
          data={eventsData[1]}
          renderItem={({ item }) => (
            <Pressable
              onPress={() =>
                router.push({
                  pathname: `/event-details/[id]`,
                  params: { id: item.id, favorite: item.favorite },
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
