import { zodResolver } from '@hookform/resolvers/zod';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation, useQuery } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import * as React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { z } from 'zod';

import { ErrorMessage } from '~/components/ErrorMessage';
import { LoadingIndicator } from '~/components/LoadingIndicator';
import ProfileAvatar from '~/components/ProfileAvatar';
import ProfileInput from '~/components/ProfileInput';
import { Button } from '~/components/ui/button';
import UploadModal from '~/components/UploadModal';
import { useRefreshByUser } from '~/hooks/useRefreshByUser';
import { createPresignedUrl, createUploadPresignedUrl, fetchUser, updateUserProfile, uploadFile } from '~/lib/api/api';
import { User } from '~/lib/interfaces/user';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const ProfileFormSchema = z.object({
  username: z.string().min(1, 'Username is required.'),
  email: z.string().email('Please enter a valid email.'),
  bucketId: z.string().nullable(),
});

type ProfileForm = z.infer<typeof ProfileFormSchema>;

function checkChanges(user: ProfileForm, data: ProfileForm) {
  return user.username !== data.username || user.email !== data.email;
}

export default function EditProfile() {
  const [image, setImage] = React.useState<string | null>('');
  const [uploadImage, setUploadImage] = React.useState<ImagePicker.ImagePickerSuccessResult | null>(null);
  const [modalVisible, setModalVisible] = React.useState<boolean>(false);
  const { isPending, error, data, refetch } = useQuery<Pick<User, 'bucketId' | 'email' | 'phone' | 'username'>, Error>({
    queryKey: ['user'],
    queryFn: fetchUser,
  });
  const { isRefetchingByUser, refetchByUser } = useRefreshByUser(refetch);
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ProfileForm>({
    defaultValues: {
      username: data?.username,
      email: data?.email,
      bucketId: data?.bucketId,
    },
    resolver: zodResolver(ProfileFormSchema),
  });
  const profileMutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      alert('Profile updated');
      router.navigate('/(profile)');
    },
    onError: (error) => {
      console.error(error);
    },
  });

  if (!data) return null;

  if (isPending) return <LoadingIndicator />;
  if (error) return <ErrorMessage message={error.message}></ErrorMessage>;

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
        setUploadImage(result);
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
        setUploadImage(result);
        await saveImage(result.assets[0].uri);
      }
    } catch (error) {
      alert(error);
    }
  };

  const removeImage = async () => {
    try {
      setUploadImage(null);
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

  const onSubmit: SubmitHandler<ProfileForm> = async (formData) => {
    if (checkChanges(data, formData) || image !== '') {
      formData = {
        ...formData,
        bucketId: data.bucketId,
      };

      if (image !== null && uploadImage !== null) {
        const imageFormData = new FormData();
        const uuid = (await AsyncStorage.getItem('uuid')) || '';

        imageFormData.append('image', {
          uri: image,
          type: 'image/jpeg',
          file: uploadImage.assets[0],
          filename: `profile-${uuid}.jpg`,
        } as any);

        if (!data.bucketId) {
          const presignedUrl = await createPresignedUrl();
          uploadFile({ file: imageFormData, url: presignedUrl.url, id: presignedUrl.id });
          formData.bucketId = presignedUrl.id;
        } else {
          const presignedUrl = await createUploadPresignedUrl({ id: data.bucketId });
          uploadFile({ file: imageFormData, url: presignedUrl.url, id: presignedUrl.id });
          formData.bucketId = presignedUrl.id;
        }
      }

      profileMutation.mutate(formData);
    }
  };

  return (
    <KeyboardAvoidingView className='flex-1' behavior={Platform.OS === 'ios' ? 'position' : 'height'}>
      <SafeAreaView className='h-full'>
        <ScrollView
          refreshControl={<RefreshControl refreshing={isRefetchingByUser} onRefresh={refetchByUser} />}
          className='w-full'
          contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View className='w-full gap-6 justify-around items-center'>
            <View className='w-full'>
              <Pressable className='items-center gap-6 pb-6' onPress={() => setModalVisible(true)}>
                <ProfileAvatar uri={(image as string) || `${apiUrl}/files/${data.bucketId}`} alt={data?.username} />
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
                  name='username'
                  rules={{ required: true }}
                />
                {errors.username && (
                  <Text className='text-sm font-medium text-destructive'>{errors.username.message}</Text>
                )}

                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <ProfileInput label='Email' value={value} onBlur={onBlur} onChangeText={onChange} />
                  )}
                  name='email'
                  rules={{ required: true }}
                />
                {errors.email && <Text className='text-sm font-medium text-destructive'>{errors.email.message}</Text>}
              </View>
            </TouchableWithoutFeedback>
          </View>

          <View className='w-full p-10'>
            <Button className='rounded bg-primary' onPress={handleSubmit(onSubmit)} disabled={isSubmitting}>
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
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
