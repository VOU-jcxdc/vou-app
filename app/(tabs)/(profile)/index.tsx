import * as React from 'react';
import { SafeAreaView, Text, View } from 'react-native';

import ProfileAvatar from '~/components/ProfileAvatar';
import ProfileInput from '~/components/ProfileInput';
import { Button } from '~/components/ui/button';
import { useAuth } from '~/context/AuthContext';

const user = {
  userName: 'minen1712',
  phone: '0123456789',
  email: 'tranminhanh1912@gmail.com',
  image: 'https://picsum.photos/id/1/200/300',
};

export default function Profile() {
  const { clearAuthInfo } = useAuth();

  const handleSignOut = () => {
    clearAuthInfo();
  };

  return (
    <SafeAreaView className='h-full items-center justify-around'>
      <View className='w-full gap-6'>
        <View className='w-full items-center gap-6'>
          <ProfileAvatar uri={user?.image} alt={user?.userName} />
          <Text className='text-3xl font-semibold'>{user?.userName}</Text>
        </View>
        <View className='w-full gap-6 px-10'>
          <ProfileInput label='Username' value={user?.userName} readOnly={true} />
          <ProfileInput label='Phone' value={user?.phone} readOnly={true} />
          <ProfileInput label='Email' value={user?.email} readOnly={true} />
        </View>
      </View>

      <View className='w-full px-10'>
        <Button className='rounded bg-primary' onPress={handleSignOut}>
          <Text className='font-bold text-primary-foreground'>Sign Out</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
