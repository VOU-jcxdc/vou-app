import Ionicons from '@expo/vector-icons/Ionicons';
import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { DeviceMotion } from 'expo-sensors';
import React, { useEffect } from 'react';
import { Pressable, SafeAreaView, Text, Vibration, View } from 'react-native';
import ShakeItemModal from '~/components/ShakeItemModal';

const defaultConfig = 10;

export async function fetchItem(): Promise<ItemTemp> {
  const id = Math.floor(Math.random() * 5) + 1;

  const response = await fetch(`https://66a253fa967c89168f1fa708.mockapi.io/items/${id}`);
  const data = await response.json();

  return Promise.resolve(data as ItemTemp);
}

export default function ShakeGame() {
  const queryClient = useQueryClient();
  const [config, setConfig] = React.useState<number>(defaultConfig);
  const [modalVisible, setModalVisible] = React.useState<boolean>(false);
  const [item, setItem] = React.useState<ItemTemp | null>(null);

  useEffect(() => {
    if (!modalVisible && config > 0) {
      DeviceMotion.addListener(onDeviceMotionChange);
    }
    return () => {
      DeviceMotion.removeAllListeners();
    };
  }, [modalVisible, config]);

  const onDeviceMotionChange = async (event: any) => {
    const acceleration = event.accelerationIncludingGravity;
    const g = 9.81;
    const x = acceleration.x / g;
    const y = acceleration.y / g;
    const z = acceleration.z / g;
    const total = Math.sqrt(x * x + y * y + z * z);
    if (total > 3) {
      const data = await queryClient.fetchQuery({
        queryKey: ['items'],
        queryFn: fetchItem,
      });
      setItem(data);
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
        id={item?.id || 1}
        name={item?.name || 'Item'}
        image={item?.image || 'https://picsum.photos/id/106/200/300'}
      />
    </SafeAreaView>
  );
}
