import { useQuery } from '@tanstack/react-query';
import { FlatList, SafeAreaView, View } from 'react-native';

import EventCard from '~/components/EventCard';
import { Skeleton } from '~/components/ui/skeleton';

const fetchFavoriteEvents = async () => {
  const res = await fetch('https://66a253fa967c89168f1fa708.mockapi.io/events');
  return res.json();
};

export default function FavoriteEvents() {
  const { data, isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: fetchFavoriteEvents,
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
  return (
    <SafeAreaView className='mx-6 h-full gap-4'>
      <View className='flex-1 gap-4'>
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <EventCard
              id={item.id}
              name={item.name}
              brand_name={item.brand_name}
              begin_date={item.begin_date}
              end_date={item.end_date}
              image={item.image}
              page='favorite-events'
            />
          )}
          ItemSeparatorComponent={() => <View className='h-4' />}
          keyExtractor={(item) => item.id}
        />
      </View>
    </SafeAreaView>
  );
}
