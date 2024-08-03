import Ionicons from '@expo/vector-icons/Ionicons';
import { ActivityIndicator, Modal, Pressable, Text, View } from 'react-native';

import { Colors } from '~/constants/Colors';

import { Button } from './ui/button';

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
  const color = Colors['light'].tint;

  return (
    <Modal animationType='slide' transparent={true} visible={modalVisible} onRequestClose={onBackPress}>
      <Pressable className='mx-5 my-10 flex-1 justify-center items-center shadow-md' onPress={onBackPress}>
        {isLoading && <ActivityIndicator size={70} color={color} />}

        {!isLoading && (
          <View className='w-full px-5 py-10 justify-center items-center gap-6 rounded-3xl bg-white'>
            <Text className='text-2xl font-semibold'>Profile Photo</Text>
            <View className='flex flex-row items-center gap-4'>
              <Button size='lg' onPress={onCameraPress}>
                <Ionicons name='camera-outline' size={40} color={color} />
                <Text>Camera</Text>
              </Button>
              <Button size='lg' onPress={onGalleryPress}>
                <Ionicons name='image-outline' size={40} color={color} />
                <Text>Gallery</Text>
              </Button>
              <Button size='lg' onPress={onRemovePress}>
                <Ionicons name='trash-bin-outline' size={40} color='red' />
                <Text>Remove</Text>
              </Button>
            </View>
          </View>
        )}
      </Pressable>
    </Modal>
  );
}
