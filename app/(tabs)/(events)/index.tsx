import { useQuery } from '@tanstack/react-query';
import { FlatList, SafeAreaView, Text, View } from 'react-native';

import EventCard from '~/components/EventCard';
import { Skeleton } from '~/components/ui/skeleton';

const fetchEvents = async () => {
  const res = await fetch('https://66a253fa967c89168f1fa708.mockapi.io/events');
  return res.json();
};

export default function Events() {
  const { data, isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: fetchEvents,
  });

  if (isLoading) {
    return (
      <View className='aspect-video h-auto w-full items-center'>
        <Skeleton className='mb-4 h-64 w-[372px]' />
        <Skeleton className='h-screen w-[372px]' />
      </View>
    );
  }

  return (
    <SafeAreaView className='mx-6 mb-6 h-full gap-4'>
      <View className='gap-4'>
        <Text className='text-xl font-bold'>Current Events</Text>
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
              horizontal={true}
            />
          )}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View className='w-4' />}
          horizontal
        />
      </View>
      <View className='flex-1 gap-4'>
        <Text className='text-xl font-bold'>In-coming Events</Text>
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
            />
          )}
          ItemSeparatorComponent={() => <View className='h-4' />}
          keyExtractor={(item) => item.id}
        />
      </View>
    </SafeAreaView>
  );
}
