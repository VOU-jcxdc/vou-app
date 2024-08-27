import Ionicons from '@expo/vector-icons/Ionicons';
import { Modal, Pressable, Text, View } from 'react-native';

import { Skeleton } from './ui/skeleton';

type UploadModalProps = {
  modalVisible: boolean;
  onBackPress: () => void;
  onCameraPress: () => void;
  onGalleryPress: () => void;
  onRemovePress: () => void;
  isLoading?: boolean;
};

export default function UploadModal({
  modalVisible,
  onBackPress,
  onCameraPress,
  onGalleryPress,
  onRemovePress,
  isLoading = false,
}: UploadModalProps) {
  return (
    <Modal animationType='slide' transparent={true} visible={modalVisible} onRequestClose={onBackPress}>
      <Pressable className='mx-5 my-10 flex-1 items-center justify-center shadow-md' onPress={onBackPress}>
        {isLoading && <Skeleton className='h-full w-full' />}

        {!isLoading && (
          <View className='w-full items-center justify-center gap-6 rounded-3xl bg-background px-5 py-10 border'>
            <Text className='text-2xl font-semibold'>Profile Photo</Text>
            <View className='flex flex-row items-center gap-6'>
              <Pressable className='h-20 w-24 items-center justify-center rounded bg-secondary' onPress={onCameraPress}>
                <Ionicons name='camera-outline' size={40} color='bg-primary' />
                <Text>Camera</Text>
              </Pressable>
              <Pressable
                className='h-20 w-24 items-center justify-center rounded bg-secondary'
                onPress={onGalleryPress}>
                <Ionicons name='image-outline' size={40} color='bg-primary' />
                <Text>Gallery</Text>
              </Pressable>
              <Pressable className='h-20 w-24 items-center justify-center rounded bg-secondary' onPress={onRemovePress}>
                <Ionicons name='trash-bin-outline' size={40} color='bg-destructive' />
                <Text>Remove</Text>
              </Pressable>
            </View>
          </View>
        )}
      </Pressable>
    </Modal>
  );
}
