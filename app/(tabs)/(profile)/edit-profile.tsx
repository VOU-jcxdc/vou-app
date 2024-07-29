import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import ProfileAvatar from '~/components/ProfileAvatar';
import ProfileInput from '~/components/ProfileInput';
import { Button } from '~/components/ui/button';
import UploadModal from '~/components/UploadModal';

const user = {
  userName: 'minen1712',
  fullName: 'Trần Minh Anh',
  phone: '0123456789',
  email: 'tranminhanh1912@gmail.com',
  image: 'https://picsum.photos/id/1/200/300',
};

type ProfileForm = {
  userName: string;
  fullName: string;
  phone: string;
  email: string;
};

function checkChanges(user: ProfileForm, data: ProfileForm) {
  return (
    user.userName !== data.userName ||
    user.fullName !== data.fullName ||
    user.phone !== data.phone ||
    user.email !== data.email
  );
}

export default function EditProfile() {
  const [modalVisible, setModalVisible] = React.useState<boolean>(false);
  const [image, setImage] = React.useState<string | null>(null);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      userName: user?.userName,
      fullName: user?.fullName,
      phone: user?.phone,
      email: user?.email,
    },
  });

  const uploadCameraImage = async () => {
    try {
      await ImagePicker.requestCameraPermissionsAsync();
      const result = await ImagePicker.launchCameraAsync({
        cameraType: ImagePicker.CameraType.front,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        await saveImage(result.assets[0].uri);
      }
    } catch (error) {
      alert(error);
    }
  };

  const uploadGalleryImage = async () => {
    try {
      await ImagePicker.requestMediaLibraryPermissionsAsync();
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        await saveImage(result.assets[0].uri);
      }
    } catch (error) {
      alert(error);
    }
  };

  const removeImage = async () => {
    try {
      await saveImage(null);
    } catch (error) {
      alert(error);
      setModalVisible(false);
    }
  };

  const saveImage = async (image: string | null) => {
    try {
      setImage(image);
      setModalVisible(false);
    } catch (error) {
      alert(error);
    }
  };

  const onSubmit = (data: ProfileForm) => {
    if (checkChanges(user, data) || image) {
      const updatedUser = {
        ...data,
        image: image || user?.image,
      };
      alert(JSON.stringify(updatedUser));
    }

    //Mutation

    router.navigate('(profile)');
  };

  return (
    <KeyboardAvoidingView className='flex-1' behavior={Platform.OS === 'ios' ? 'position' : 'height'}>
      <SafeAreaView className='h-full items-center justify-around'>
        <View className='w-full gap-6'>
          <View className='w-full'>
            <Pressable className='items-center gap-6' onPress={() => setModalVisible(true)}>
              <ProfileAvatar uri={image || user?.image} alt={user?.userName} />
              <Text className='text-foreground'>Edit Profile Picture</Text>
            </Pressable>
          </View>

          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View className='w-full gap-6 px-10'>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <ProfileInput label='Username' value={value} onBlur={onBlur} onChangeText={onChange} />
                )}
                name='userName'
                rules={{ required: true }}
              />
              {errors.userName && <Text className='text-sm font-medium text-destructive'>This is required.</Text>}

              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <ProfileInput label='Full Name' value={value} onBlur={onBlur} onChangeText={onChange} />
                )}
                name='fullName'
                rules={{ required: true }}
              />
              {errors.fullName && <Text className='text-sm font-medium text-destructive'>This is required.</Text>}

              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <ProfileInput
                    label='Phone'
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    keyboardType='phone-pad'
                  />
                )}
                name='phone'
                rules={{ required: true, pattern: /^[0-9]{10}$/ }}
              />
              {errors.phone && <Text className='text-sm font-medium text-destructive'>This is required.</Text>}

              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <ProfileInput label='Email' value={value} onBlur={onBlur} onChangeText={onChange} />
                )}
                name='email'
                rules={{ required: true, pattern: /^\S+@\S+$/i }}
              />
              {errors.email && <Text className='text-sm font-medium text-destructive'>This is required.</Text>}
            </View>
          </TouchableWithoutFeedback>
        </View>

        <View className='w-full px-10'>
          <Button className='rounded bg-primary' onPress={handleSubmit(onSubmit)}>
            <Text className='font-bold text-primary-foreground'>Save</Text>
          </Button>
        </View>

        <UploadModal
          modalVisible={modalVisible}
          onBackPress={() => setModalVisible(false)}
          onCameraPress={uploadCameraImage}
          onGalleryPress={uploadGalleryImage}
          onRemovePress={removeImage}
        />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
