import * as React from 'react';
import { Text, View } from 'react-native';

type Props = {
  message: string;
};

export function ErrorMessage({ message }: Props) {
  return (
    <View className='flex-1 justify-center items-center'>
      <Text>{message}</Text>
    </View>
  );
}
