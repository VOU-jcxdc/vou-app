import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, Image, Pressable, SafeAreaView, View } from 'react-native';
import Toast from 'react-native-toast-message';
import ItemCard from '~/components/ItemCard';
import { LoadingIndicator } from '~/components/LoadingIndicator';
import { Button } from '~/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { Text } from '~/components/ui/text';
import {
  acceptRequest,
  fetchAccountItems,
  fetchReceivedRequests,
  fetchSendedRequests,
  rejectRequest,
  searchPlayers,
} from '~/lib/api/api';
import { getTimeDifference } from '~/utils/DateTimeUtils';

const apiURl = process.env.EXPO_PUBLIC_API_URL;

export default function Gifts() {
  const [tab, setTab] = useState('received');
  const queryClient = useQueryClient();

  const { data, isPending: accountItemsPending } = useQuery({
    queryKey: ['account-items'],
    queryFn: fetchAccountItems,
  });

  const accountItems = data?.sort((a, b) => new Date(b.assignedDate).getTime() - new Date(a.assignedDate).getTime());

  const { data: receivedRequests, isPending: receivedReqPending } = useQuery({
    queryKey: ['received-requests'],
    queryFn: fetchReceivedRequests,
  });

  const { data: sendedRequests, isPending: sendedReqPending } = useQuery({
    queryKey: ['sended-requests'],
    queryFn: fetchSendedRequests,
  });

  const { data: players } = useQuery({
    queryKey: ['search-players', ''],
    queryFn: searchPlayers,
  });

  const acceptReqMutation = useMutation({
    mutationFn: acceptRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['received-requests'] });
      queryClient.invalidateQueries({ queryKey: ['account-items'] });
    },
  });

  const declineReqMutation = useMutation({
    mutationFn: rejectRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['received-requests'] });
    },
  });

  if (accountItemsPending) {
    return <LoadingIndicator />;
  }

  if (!accountItems) {
    return null;
  }

  if (accountItems.length === 0) {
    return (
      <View className='flex-1 justify-center items-center'>
        <Text className='text-2xl'>You currently have no items</Text>
      </View>
    );
  }

  const renderHeader = () => (
    <>
      <Text className='text-xl font-bold mb-4'>My items</Text>
      <FlatList
        data={accountItems}
        renderItem={({ item }) => {
          const itemInfo = item.item;
          return (
            <Pressable
              className='flex-1'
              onPress={() =>
                router.push({
                  pathname: `/item-details/[id]`,
                  params: { id: itemInfo.id, accountItems: JSON.stringify(accountItems) },
                })
              }>
              <ItemCard id={itemInfo.id} name={itemInfo.name} quantity={item.quantity} imageId={itemInfo.imageId} />
            </Pressable>
          );
        }}
        numColumns={3}
        key={`flatlist-${3}`}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View className='h-4' />}
        columnWrapperClassName='gap-4'
        className='w-full'
      />
      <Text className='text-xl font-bold my-4'>Requests</Text>
      <Tabs value={tab} onValueChange={setTab} className='w-full mx-auto flex-col gap-1.5'>
        <TabsList className='flex-row w-full'>
          <TabsTrigger value='received' className='flex-1'>
            <Text>Received</Text>
          </TabsTrigger>
          <TabsTrigger value='sended' className='flex-1'>
            <Text>Sended</Text>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </>
  );

  const renderFooter = () => <Toast />;

  const renderRequests = () => {
    if (tab === 'received') {
      return receivedReqPending ? (
        <LoadingIndicator />
      ) : (
        <FlatList
          data={receivedRequests}
          renderItem={({ item }) => {
            const player = players?.find((player) => player.id === item.senderId);
            const imageUri = item.item.imageId
              ? `${apiURl}/files/${item.item.imageId}?${new Date().getTime()}`
              : 'https://picsum.photos/id/1/200/300';

            return (
              <View className='flex-row gap-4 items-center py-4'>
                <View className='flex-col items-center w-32 gap-1'>
                  <Image className='rounded-full h-12 w-12' source={{ uri: imageUri }} />
                  <Text className='text-base font-semibold text-center'>{item.item.name}</Text>
                </View>
                <View className='flex-col gap-1 flex-1' key={item.id}>
                  <View className='flex flex-row justify-between items-center'>
                    <Text className='text-lg font-semibold'>{player?.username}</Text>
                    <Text className='text-muted-foreground text-sm'>{getTimeDifference(item.sendDate)}</Text>
                  </View>
                  <Text className='text-muted-foreground text-wrap pb-1'>{player?.email}</Text>
                  <View className='flex-row gap-2 w-full'>
                    <Button
                      variant='default'
                      size='sm'
                      className='flex-grow'
                      onPress={() => acceptReqMutation.mutate({ id: item.id })}>
                      <Text>Accept</Text>
                    </Button>
                    <Button
                      variant='secondary'
                      size='sm'
                      className='flex-grow'
                      onPress={() => declineReqMutation.mutate({ id: item.id })}>
                      <Text>Decline</Text>
                    </Button>
                  </View>
                </View>
              </View>
            );
          }}
          key={`flatlist-${4}`}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View className='border-b-2 border-b-gray-200' />}
          ListEmptyComponent={() => (
            <View>
              <Text className='text-lg'>No results found</Text>
            </View>
          )}
        />
      );
    } else {
      return sendedReqPending ? (
        <LoadingIndicator />
      ) : (
        <FlatList
          data={sendedRequests}
          renderItem={({ item }) => {
            const player = players?.find((player) => player.id === item.receiverId);
            const imageUri = item.item.imageId
              ? `${apiURl}/files/${item.item.imageId}?${new Date().getTime()}`
              : 'https://picsum.photos/id/1/200/300';

            return (
              <View className='flex-row gap-4 items-center'>
                <Image className='rounded-full h-12 w-12' source={{ uri: imageUri }} />
                <View className='flex-col p-3' key={item.id}>
                  <Text className='font-medium text-lg'>{item.item.name}</Text>
                  <Text className='text-muted-foreground text-wrap'>
                    Send request to {player?.username} at {new Date(item.sendDate).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            );
          }}
          key={`flatlist-${5}`}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View className='border-b-2 border-b-gray-200' />}
          ListEmptyComponent={() => (
            <View>
              <Text className='text-lg'>No results found</Text>
            </View>
          )}
        />
      );
    }
  };

  return (
    <SafeAreaView className='flex-1'>
      <FlatList
        data={[]}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        renderItem={null}
        ListEmptyComponent={renderRequests}
        className='mx-4 my-6'
      />
    </SafeAreaView>
  );
}
