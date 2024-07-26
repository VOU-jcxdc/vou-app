import * as React from 'react';
import { SafeAreaView, Text, View } from 'react-native';

import ProfileAvatar from '~/components/ProfileAvatar';
import ProfileInput from '~/components/ProfileInput';
import { Button } from '~/components/ui/button';

const user = {
  userName: 'minen1712',
  fullName: 'Trần Minh Anh',
  phone: '0123456789',
  email: 'tranminhanh1912@gmail.com',
  image: 'https://picsum.photos/id/1/200/300',
};

export default function Profile() {
  const handleSignOut = () => {
    alert('Sign out');
  };

  return (
    <SafeAreaView className='h-full justify-around items-center'>
      <View className='w-full gap-6'>
        <View className='w-full items-center gap-6'>
          <ProfileAvatar uri={user?.image} alt={user?.userName} />
          <Text className='text-3xl font-semibold'>{user?.fullName}</Text>
        </View>
        <View className='w-full px-10 gap-6'>
          <ProfileInput label='Username' value={user?.userName} readOnly={true} />
          <ProfileInput label='Full Name' value={user?.fullName} readOnly={true} />
          <ProfileInput label='Phone' value={user?.phone} readOnly={true} />
          <ProfileInput label='Email' value={user?.email} readOnly={true} />
        </View>
      </View>

      <View className='w-full px-10'>
        <Button className='bg-purple-500 rounded' onPress={handleSignOut}>
          <Text className='text-white font-bold'>Sign Out</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
