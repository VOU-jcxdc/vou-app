import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { FlatList, SafeAreaView, View } from 'react-native';
import ItemCard from '~/components/ItemCard';
import { LoadingIndicator } from '~/components/LoadingIndicator';
import { fetchEventItems } from '~/lib/api/api';

export default function Inventory() {
  const { eventId } = useLocalSearchParams();
  const { data, isLoading } = useQuery({
    queryKey: ['inventory', eventId as string],
    queryFn: fetchEventItems,
  });

  if (isLoading) {
    return (
      <View className='flex justify-center items-center'>
        <LoadingIndicator />
      </View>
    );
  }

  return (
    <SafeAreaView className='m-6 h-full gap-4'>
      <View className='flex-1 gap-4'>
        <FlatList
          data={data}
          numColumns={2}
          renderItem={({ item }) => {
            return <ItemCard {...item} />;
          }}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View className='h-5' />}
        />
      </View>
    </SafeAreaView>
  );
}
