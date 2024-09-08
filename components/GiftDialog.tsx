import Ionicons from '@expo/vector-icons/Ionicons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, FlatList, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { useAuth } from '~/context/AuthContext';
import { useDebounce } from '~/hooks/useDebounce';
import { requestItem, searchPlayers, sendGift } from '~/lib/api/api';
import { Item, SearchPlayer } from '~/lib/interfaces';
import { normalizePhoneNumber, replacePrefixPhone } from '~/utils/PhoneUtils';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Text } from './ui/text';

function HighlightedText({ text, highlight, className }: { text: string; highlight: string; className?: string }) {
  if (!highlight.trim()) {
    return <Text className={className}>{text}</Text>;
  }
  const regex = new RegExp(`(${highlight})`, 'gi');
  const parts = text.split(regex);
  return (
    <Text className={className}>
      {parts.map((part, index) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <Text key={index} className='text-primary'>
            {part}
          </Text>
        ) : (
          part
        )
      )}
    </Text>
  );
}

export default function GiftDialog({
  open,
  onOpenChange,
  curItem,
  title,
  description,
  type,
  eventId = '',
  handleOnSuccessReq,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  curItem?: Item;
  title: string;
  description: string;
  type: 'give' | 'request';
  eventId?: string;
  handleOnSuccessReq?: () => void;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<SearchPlayer>();
  const [clicked, setClicked] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 1000);
  const { userId } = useAuth();
  const queryClient = useQueryClient();

  const { data, isPending } = useQuery({
    queryKey: ['search-players', replacePrefixPhone(debouncedSearchQuery)],
    queryFn: searchPlayers,
  });

  const sendGiftMutation = useMutation({
    mutationFn: sendGift,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['account-items'] });
      router.back();
      Toast.show({
        type: 'success',
        text1: `Đã tặng ${curItem?.name} thành công cho ${selectedUser?.username}`,
        visibilityTime: 1500,
      });
      onOpenChange(false);
    },
  });

  const requestItemMutation = useMutation({
    mutationFn: requestItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sended-requests'] });
      Toast.show({
        type: 'success',
        text1: `Đã gửi yêu cầu ${curItem?.name} thành công tới ${selectedUser?.username}`,
        visibilityTime: 1500,
      });
      onOpenChange(false);
      handleOnSuccessReq && handleOnSuccessReq();
    },
  });

  const handleGiveItem = () => {
    const body = {
      senderId: userId as string,
      receiverId: selectedUser?.id as string,
      itemId: curItem ? curItem.id : eventId,
      eventId: curItem ? curItem.eventId : eventId,
    };
    sendGiftMutation.mutate(body);
  };

  const handleRequestItem = () => {
    const body = {
      senderId: userId as string,
      receiverId: selectedUser?.id as string,
      itemId: curItem ? curItem.id : eventId,
      eventId: curItem ? curItem.eventId : eventId,
      quantity: 1,
    };
    requestItemMutation.mutate(body);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className='sm:max-w-[425px] flex-col'>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <View>
            <View className='flex-row border items-center border-gray-300 rounded-3xl'>
              <Ionicons name='search' size={24} className='ml-3' color='#d1d5db' />
              <Input
                placeholder='Search by phone, email or username'
                onChangeText={(value) => {
                  setSearchQuery(value);
                  clicked && setClicked(false);
                }}
                value={searchQuery}
                className='flex-1 border-0 bg-inherit'
              />
            </View>
            {searchQuery.length > 0 && !clicked ? (
              isPending || searchQuery !== debouncedSearchQuery ? (
                <ActivityIndicator className='pt-3' />
              ) : (
                <FlatList
                  data={data}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      className='flex-col p-3 '
                      key={item.id}
                      onPress={() => {
                        setSelectedUser(item);
                        setClicked(true);
                      }}>
                      <Text className='font-medium text-lg'>
                        <HighlightedText text={item.username} highlight={debouncedSearchQuery} />
                      </Text>
                      <Text>
                        <HighlightedText
                          text={normalizePhoneNumber(item.phone)}
                          highlight={debouncedSearchQuery}
                          className='text-muted-foreground'
                        />{' '}
                        -{' '}
                        <HighlightedText
                          text={item.email}
                          highlight={debouncedSearchQuery}
                          className='text-muted-foreground'
                        />
                      </Text>
                    </TouchableOpacity>
                  )}
                  className='flex-grow-0'
                  ItemSeparatorComponent={() => <View className='border-b-2 border-b-gray-200' />}
                  ListEmptyComponent={() => (
                    <View className='flex-col p-3'>
                      <Text className='text-lg'>No results found</Text>
                    </View>
                  )}
                />
              )
            ) : (
              (clicked || selectedUser) && (
                <View className='flex-col p-3'>
                  <Text className='font-medium text-lg'>{selectedUser?.username}</Text>
                  <Text className='text-muted-foreground'>
                    {selectedUser?.phone} - {selectedUser?.email}
                  </Text>
                </View>
              )
            )}
          </View>
          <DialogFooter className=''>
            <Button onPress={type === 'give' ? handleGiveItem : handleRequestItem} disabled={!selectedUser}>
              <Text>{type === 'give' ? 'Give item' : 'Send request'}</Text>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
