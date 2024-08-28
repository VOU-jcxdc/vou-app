import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { DeviceMotion } from 'expo-sensors';
import React, { useEffect } from 'react';
import { Pressable, SafeAreaView, Text, Vibration, View } from 'react-native';
import ShakeItemModal from '~/components/ShakeItemModal';

const defaultConfig = 10;

export default function ShakeGame() {
  // const { data, isLoading } = useQuery({
  //   queryKey: ['items'],
  //   queryFn: fetchItems,
  // });

  const [config, setConfig] = React.useState<number>(defaultConfig);
  const [modalVisible, setModalVisible] = React.useState<boolean>(false);

  // if (isLoading) {
  //   return (
  //     <View className='aspect-video h-auto w-full items-center'>
  //       <Skeleton className='h-screen w-screen' />
  //     </View>
  //   );
  // }

  useEffect(() => {
    if (!modalVisible && config > 0) {
      DeviceMotion.addListener(onDeviceMotionChange);
    }
    return () => {
      DeviceMotion.removeAllListeners();
    };
  }, [modalVisible, config]);

  const onDeviceMotionChange = (event: any) => {
    const acceleration = event.accelerationIncludingGravity;
    const g = 9.81;
    const x = acceleration.x / g;
    const y = acceleration.y / g;
    const z = acceleration.z / g;
    const total = Math.sqrt(x * x + y * y + z * z);
    if (total > 5) {
      setModalVisible(true);
      Vibration.vibrate();
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View className=' p-10 items-center justify-center flex-1'>
        <View className='basis-1/3' />

        <Text className='text-4xl font-semibold'>Shake your phone!</Text>
        <Ionicons className='my-4' name='phone-portrait-outline' size={60} color='black' />
        <Text className='text-2xl font-semibold'>{config} shakes left</Text>

        <View className='grow' />

        <Pressable
          className='bg-black rounded-full p-5'
          onPress={() =>
            router.push({
              pathname: `/inventory`,
              params: { id: 1 },
            })
          }>
          <Ionicons name='gift-outline' size={64} color='white' />
        </Pressable>
      </View>
      <ShakeItemModal
        modalVisible={modalVisible}
        onBackPress={() => {
          setModalVisible(false);
          setConfig(config - 1);
        }}
        id={1}
        name='Flower'
        image=''
      />
    </SafeAreaView>
  );
}
