import React from 'react';
import { Image, Modal, Pressable, Text, View } from 'react-native';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';

export type ItemProps = {
  id: number;
  name: string;
  image: string;
};

type ShakeItemModalProps = {
  modalVisible: boolean;
  onBackPress: () => void;
  isLoading?: boolean;
};

export default function ShakeItemModal({
  modalVisible,
  onBackPress,
  isLoading = false,
  id,
  name,
  image,
}: ShakeItemModalProps & ItemProps) {
  return (
    <Modal animationType='slide' transparent={true} visible={modalVisible}>
      <Pressable className='mx-5 my-10 flex-1 items-center justify-center shadow-md'>
        {isLoading && <Skeleton className='h-full w-full' />}

        {!isLoading && (
          <View className='w-full items-center justify-center gap-6 rounded-3xl bg-white px-5 py-10 border'>
            <Text className='text-2xl font-semibold'>You win an item!</Text>
            <Image className='w-40 h-40' source={{ uri: 'https://picsum.photos/id/106/200/300' }} />
            <Text className='text-xl font-semibold'>{name}</Text>

            <View className='w-full px-5'>
              <Button className='rounded bg-primary' onPress={onBackPress}>
                <Text className='font-bold text-primary-foreground'>Done</Text>
              </Button>
            </View>
          </View>
        )}
      </Pressable>
    </Modal>
  );
}
