import * as React from 'react';
import { ActivityIndicator, View } from 'react-native';

export function LoadingIndicator() {
  return (
    <View className=' flex-1 justify-center items-center'>
      <ActivityIndicator size='large' />
    </View>
  );
}
