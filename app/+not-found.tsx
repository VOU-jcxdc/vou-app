import { Link, Stack } from 'expo-router';
import { Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View className='w-full h-full items-center'>
        <Text>This screen doesn&apos;t exist.</Text>
        <Link href='/'>
          <Text>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}
