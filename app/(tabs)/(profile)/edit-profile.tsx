import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
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
import { fetchUser } from '~/lib/api/api';
import { User } from '~/lib/interfaces/user';

const ProfileFormSchema = z.object({
  username: z.string().min(1, 'Username is required.'),
  phone: z.string().min(10, 'Phone number is invalid.').max(11, 'Phone number is invalid.'),
  email: z.string().email('Please enter a valid email.'),
});

type ProfileForm = z.infer<typeof ProfileFormSchema>;

function checkChanges(user: ProfileForm, data: ProfileForm) {
  return user.username !== data.username || user.phone !== data.phone || user.email !== data.email;
}

export default function EditProfile() {
  const [modalVisible, setModalVisible] = React.useState<boolean>(false);
  const [image, setImage] = React.useState<string | null>(null);
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
      phone: data?.phone,
      email: data?.email,
    },
    resolver: zodResolver(ProfileFormSchema),
  });

  if (isPending) return <LoadingIndicator />;
  if (error) return <ErrorMessage message={error.message}></ErrorMessage>;
  if (!data) return null;

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

  const onSubmit: SubmitHandler<ProfileForm> = (formData) => {
    if (checkChanges(data, formData) || image) {
      alert(JSON.stringify(formData));
      if (image !== data.bucketId) {
        fetch('https://146.190.100.11:3000/files/presigned-url', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            file: image,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            fetch(data.url, {
              method: 'PUT',
              headers: {
                'Content-Type': 'image/jpeg',
              },
              body: image,
            })
              .then((response) => response.json())
              .then((data) => {
                fetch('https://146.190.100.11:3000/files/upload-confirmation', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    file: data.key,
                  }),
                })
                  .then((response) => response.json())
                  .then((data) => {
                    console.log('Success:', data);
                  })
                  .catch((error) => {
                    console.error('Error:', error);
                  });
              })
              .catch((error) => {
                console.error('Error:', error);
              });
          })
          .catch((error) => {
            console.error('Error:', error);
          });
      }
    }

    //Mutation

    router.navigate('/(profile)');
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
              <Pressable className='items-center gap-6' onPress={() => setModalVisible(true)}>
                <ProfileAvatar
                  uri={image || data?.bucketId || 'https://picsum.photos/id/1/200/300'}
                  alt={data?.username}
                />
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
                    <ProfileInput
                      label='Phone'
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      keyboardType='phone-pad'
                    />
                  )}
                  name='phone'
                  rules={{ required: true }}
                />
                {errors.phone && <Text className='text-sm font-medium text-destructive'>{errors.phone.message}</Text>}

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

          <View className='w-full px-10'>
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
