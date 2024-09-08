import Ionicons from '@expo/vector-icons/Ionicons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { DeviceMotion } from 'expo-sensors';
import { useEffect, useState } from 'react';
import { Linking, Pressable, SafeAreaView, Text, Vibration, View } from 'react-native';
import GiftDialog from '~/components/GiftDialog';
import ShakeItemModal from '~/components/ShakeItemModal';
import { Button } from '~/components/ui/button';
import { fetchItem, updateConfigs } from '~/lib/api/api';
import { Item } from '~/lib/interfaces';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export default function ShakeGame() {
  const queryClient = useQueryClient();
  const { eventId, configs, gameId } = useLocalSearchParams();
  const [config, setConfig] = useState<number>(+configs);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [item, setItem] = useState<Item | null>(null);
  const [open, setOpen] = useState(false);
  const configMutation = useMutation({
    mutationFn: (configs: number) => updateConfigs({ eventId: eventId as string, config: configs }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['configs'] });
      setConfig(data.eventConfig);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  //Use this to fetch the config from the server
  // useEffect(() => {
  //   if (config === 0) {
  //     configMutation.mutate(10);
  //   }
  // }, [config]);

  useEffect(() => {
    if (!modalVisible && config > 0) {
      DeviceMotion.addListener(onDeviceMotionChange);
    }
    return () => {
      DeviceMotion.removeAllListeners();
    };
  }, [modalVisible, config]);

  useEffect(() => {
    if (modalVisible && config > 0) {
      configMutation.mutate(-1);
      queryClient.invalidateQueries({ queryKey: ['account-items'] });
    }
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
        queryKey: ['items', eventId as string],
        queryFn: fetchItem,
      });
      setItem(data);
      setModalVisible(true);
      Vibration.vibrate();
    }
  };

  const handleGainConfig = () => {
    configMutation.mutate(1);
  };

  const handleShare = () => {
    const url =
      'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent('https://vou.netlify.app/');
    const fbUrl = 'fb://facewebmodal/f?href=' + encodeURIComponent(url);

    Linking.canOpenURL(fbUrl)
      .then((supported) => {
        handleGainConfig();
        if (supported) {
          return Linking.openURL(fbUrl);
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.error('An error occurred', err));
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View className=' p-10 items-center justify-center flex-1'>
        <View className='basis-1/3' />

        <Text className='text-4xl font-semibold'>Shake your phone!</Text>
        <Ionicons className='my-4' name='phone-portrait-outline' size={60} color='black' />
        <Text className='text-2xl font-semibold'>{config} shakes left</Text>
        {!config && (
          <View className='flex flex-row items-center justify-center'>
            <Button
              variant='link'
              size='sm'
              onPress={() => {
                setOpen(true);
              }}>
              <Text className='text-primary underline'>Request friend</Text>
            </Button>
            <Text> or </Text>
            <Button variant='link' size='sm'>
              <Text className='text-primary underline' onPress={handleShare}>
                Share to facebook
              </Text>
            </Button>
            <Text> to gain config.</Text>
          </View>
        )}

        <View className='grow' />

        <Pressable
          className='bg-primary rounded-full p-5'
          onPress={() =>
            router.push({
              pathname: '/inventory',
              params: { eventId },
            })
          }>
          <Ionicons name='gift-outline' size={64} color='white' />
        </Pressable>
      </View>
      <ShakeItemModal
        modalVisible={modalVisible}
        onBackPress={() => {
          setModalVisible(false);
        }}
        id={item?.id || ''}
        name={item?.name || 'Item'}
        image={`${apiUrl}/files/${item?.imageId}` || 'https://picsum.photos/id/106/200/300'}
      />
      {open && (
        <GiftDialog
          open={open}
          onOpenChange={setOpen}
          title='Request config'
          description='Request your friend to gain a config for playing this game.'
          type='request'
          eventId={eventId as string}
          handleOnSuccessReq={handleGainConfig}
        />
      )}
    </SafeAreaView>
  );
}
