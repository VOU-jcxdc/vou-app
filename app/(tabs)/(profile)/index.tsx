import { useQuery } from '@tanstack/react-query';
import * as React from 'react';
import { RefreshControl, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { ErrorMessage } from '~/components/ErrorMessage';
import { LoadingIndicator } from '~/components/LoadingIndicator';

import ProfileAvatar from '~/components/ProfileAvatar';
import ProfileInput from '~/components/ProfileInput';
import { Button } from '~/components/ui/button';
import { useAuth } from '~/context/AuthContext';
import { useRefreshByUser } from '~/hooks/useRefreshByUser';
import { fetchUser } from '~/lib/api/api';
import { User } from '~/lib/interfaces/user';

export default function Profile() {
  const { clearAuthInfo } = useAuth();
  const { isPending, error, data, refetch } = useQuery<Pick<User, 'bucketId' | 'email' | 'phone' | 'username'>, Error>({
    queryKey: ['user'],
    queryFn: fetchUser,
  });
  const { isRefetchingByUser, refetchByUser } = useRefreshByUser(refetch);

  React.useEffect(() => {
    if (error && error.message.includes('401')) {
      clearAuthInfo();
    }
  }, [error, clearAuthInfo]);

  if (isPending) return <LoadingIndicator />;
  if (error) return <ErrorMessage message={error.message}></ErrorMessage>;
  if (!data) return null;

  const handleSignOut = () => {
    clearAuthInfo();
  };

  return (
    <SafeAreaView className='h-full'>
      <ScrollView
        refreshControl={<RefreshControl refreshing={isRefetchingByUser} onRefresh={refetchByUser} />}
        className='w-full'
        contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View className='w-full gap-6 justify-around items-center'>
          {data ? (
            <>
              <View className='w-full items-center gap-6'>
                <ProfileAvatar
                  uri={data?.bucketId || 'https://picsum.photos/id/1/200/300'}
                  alt={data?.username || ''}
                />
                <Text className='text-3xl font-semibold'>{data?.username}</Text>
              </View>
              <View className='w-full px-10 gap-6'>
                <ProfileInput label='Username' value={data?.username} readOnly={true} />
                <ProfileInput label='Phone' value={data?.phone} readOnly={true} />
                <ProfileInput label='Email' value={data?.email} readOnly={true} />
              </View>
            </>
          ) : (
            <LoadingIndicator />
          )}
        </View>
      </ScrollView>

      <View className='w-full px-10'>
        <Button className='rounded bg-primary' onPress={handleSignOut}>
          <Text className='font-bold text-primary-foreground'>Sign Out</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
