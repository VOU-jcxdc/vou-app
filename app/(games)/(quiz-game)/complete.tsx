import { router, useLocalSearchParams } from 'expo-router';
import { Image, Pressable, SafeAreaView, Text, View } from 'react-native';

export default function QuizGameComplete() {
  const { score } = useLocalSearchParams();

  return (
    <SafeAreaView className='flex flex-1 bg-purple-100 px-6 py-10'>
      <View className='flex-1 flex items-center justify-center gap-6'>
        <Text className='text-4xl font-bold'>Quiz Completed</Text>
        <View className='bg-primary w-full py-16 rounded-xl p-4 flex items-center justify-center'>
          <Text className='font-bold text-white text-2xl'>You scored {score} points!</Text>
        </View>
        <View className='w-full items-center justify-center gap-6 rounded-3xl bg-white px-5 py-10 border'>
          <Text className='text-2xl font-semibold'>You win a prize!</Text>
          <Image className='w-40 h-40' source={{ uri: 'https://picsum.photos/id/237/200/200' }} />
          <Text className='text-xl font-semibold'>Voucher</Text>
        </View>
      </View>
      <Pressable
        className='bg-primary p-4 rounded-xl w-fit self-center items-center'
        onPress={() => router.push({ pathname: '/leaderboard' })}>
        <Text className='text-white font-bold text-lg'>View Leaderboard</Text>
      </Pressable>
    </SafeAreaView>
  );
}
