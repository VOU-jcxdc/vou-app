import { SafeAreaView, Text, View } from 'react-native';
import EventCard from '~/components/EventCard';

export default function Events() {
  return (
    <SafeAreaView className='h-full justify-center items-center'>
      <View>
        <Text className='text-2xl font-bold'>Current Events</Text>
        <EventCard />
      </View>
    </SafeAreaView>
  );
}
