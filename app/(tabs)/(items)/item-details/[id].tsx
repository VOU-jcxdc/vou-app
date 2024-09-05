import Ionicons from '@expo/vector-icons/Ionicons';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useLayoutEffect, useState } from 'react';
import { FlatList, Image, TouchableOpacity, View } from 'react-native';
import { LoadingIndicator } from '~/components/LoadingIndicator';
import { Button } from '~/components/ui/button';
import { Card } from '~/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import { Text } from '~/components/ui/text';
import { useAuth } from '~/context/AuthContext';
import { fetchRecipesItem } from '~/lib/api/api';
import { AccountItemsResponse } from '~/lib/interfaces/item';
import { Recipe } from '~/lib/interfaces/recipe';
import { cn } from '~/lib/utils';
import { formatPhoneNumberSubmit, normalizePhoneNumber } from '~/utils/PhoneUtils';

const apiURl = process.env.EXPO_PUBLIC_API_URL;

function RecipeCard({
  itemRecipe,
  target,
  targetType,
  accountItems,
}: Pick<Recipe, 'itemRecipe' | 'target' | 'targetType'> & { accountItems: AccountItemsResponse[] }) {
  const imageUri = target?.imageId
    ? `${apiURl}/files/${target.imageId}?${new Date().getTime()}`
    : 'https://picsum.photos/id/1/200/300';

  const isMergeable = itemRecipe.every((item) => {
    const itemAccount = accountItems.find((accItem) => accItem.item.id === item.itemId);
    return (itemAccount?.quantity ?? 0) >= item.quantity;
  });

  return (
    <Card>
      <View className='w-full gap-4 items-center flex-row justify-center'>
        <FlatList
          data={itemRecipe}
          renderItem={({ item, index }) => {
            const imageUri = item.imageId
              ? `${apiURl}/files/${item.imageId}?${new Date().getTime()}`
              : 'https://picsum.photos/id/1/200/300';

            const itemAccount = accountItems.find((accItem) => accItem.item.id === item.itemId);
            const isEnough = (itemAccount?.quantity ?? 0) >= item.quantity;

            const itemCls = cn(
              'h-24 w-24 flex items-center justify-center gap-2',
              isEnough ? 'opacity-100' : 'opacity-50'
            );

            return (
              <View className='flex flex-row items-center'>
                <View className={itemCls}>
                  <View className='absolute right-0 top-2 z-30'>
                    <Text className='font-medium px-2 color-primary text-xs'>
                      {itemAccount?.quantity || 0}/{item.quantity}
                    </Text>
                  </View>

                  <Image className='rounded-full h-10 w-10' source={{ uri: imageUri }} />
                  <Text className='text-xs font-semibold text-center color-primary'>{item.name}</Text>
                </View>
                <View className='mx-1 h-6 w-6'>
                  <Ionicons
                    name={index !== itemRecipe.length - 1 ? 'add' : 'reorder-two-outline'}
                    size={24}
                    color='black'
                  />
                </View>
              </View>
            );
          }}
          keyExtractor={(item) => item.itemId}
          numColumns={2}
          key={`recipelist-${2}`}
        />
        {targetType === 'item' && (
          <View className='h-28 w-28 flex items-center justify-center gap-2'>
            <Image className='rounded-full h-12 w-12' source={{ uri: imageUri }} />
            <Text className='text-sm font-semibold text-center'>{target?.name}</Text>
          </View>
        )}
      </View>
      <Button className='m-1' disabled={!isMergeable}>
        <Text className='text-lg'>Ghép ngay</Text>
      </Button>
    </Card>
  );
}

const users = [
  {
    id: '1',
    phone: '+84999999999',
    email: 'example@gmail.com',
    username: 'example',
  },
  {
    id: '2',
    phone: '+84999999989',
    email: 'a@gmail.com',
    username: 'a',
  },
  {
    id: '3',
    phone: '+84999999979',
    email: 'b@gmail.com',
    username: 'b',
  },
  {
    id: '4',
    phone: '+84999999969',
    email: 'c@gmail.com',
    username: 'c',
  },
];

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

function GiftDialog({
  open,
  onOpenChange,
  curItem,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  curItem: AccountItemsResponse;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [clicked, setClicked] = useState(false);
  const { uuid } = useAuth();

  const filteredUsers = users.filter(
    (user) =>
      user.phone.includes(formatPhoneNumberSubmit(`+84 ${searchQuery}`)) ||
      user.email.includes(searchQuery) ||
      user.username.includes(searchQuery)
  );

  const handleGiveItem = () => {
    const body = {
      senderId: uuid,
      receiverId: selectedUser,
      itemId: curItem.item.id,
      eventId: curItem.item.eventId,
      createdOn: new Date().toISOString(),
    };
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px] flex-col'>
        <DialogHeader>
          <DialogTitle>Gift exchange</DialogTitle>
          <DialogDescription>Find and choose your friend to give them this item.</DialogDescription>
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
            <FlatList
              data={filteredUsers}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className='flex-col p-3 '
                  key={item.id}
                  onPress={() => {
                    setSelectedUser(item.id);
                    setClicked(true);
                  }}>
                  <Text className='font-medium text-lg'>
                    <HighlightedText text={item.username} highlight={searchQuery} />
                  </Text>
                  <Text>
                    <HighlightedText
                      text={normalizePhoneNumber(item.phone)}
                      highlight={normalizePhoneNumber(searchQuery)}
                      className='text-muted-foreground'
                    />{' '}
                    - <HighlightedText text={item.email} highlight={searchQuery} className='text-muted-foreground' />
                  </Text>
                </TouchableOpacity>
              )}
              className='flex-grow-0'
              ItemSeparatorComponent={() => <View className='border-b-2 border-b-gray-200' />}
            />
          ) : (
            (clicked || selectedUser) && (
              <View className='flex-col p-3'>
                <Text className='font-medium text-lg'>{users.find((user) => user.id === selectedUser)?.username} </Text>
                <Text className='text-muted-foreground'>
                  {users.find((user) => user.id === selectedUser)?.phone} -{' '}
                  {users.find((user) => user.id === selectedUser)?.email}
                </Text>
              </View>
            )
          )}
        </View>
        <DialogFooter className=''>
          <Button onPress={handleGiveItem}>
            <Text>Give item</Text>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function ItemDetails() {
  const { id, accountItems } = useLocalSearchParams();
  const navigation = useNavigation();
  const [giftDialogVisible, setGiftDialogVisible] = useState(false);
  const { data, isPending } = useQuery({
    queryKey: ['recipes-item', id as string],
    queryFn: fetchRecipesItem,
  });

  const accItems: AccountItemsResponse[] = JSON.parse(accountItems as string);
  const curItem = accItems.find((item) => item.item.id === id) || accItems[0];

  useLayoutEffect(() => {
    navigation.setOptions({
      title: curItem?.item.name,
      headerRight: () => <Ionicons name='send-outline' size={24} onPress={handleHeaderRightPress} />,
    });
  }, [navigation]);

  const handleHeaderRightPress = () => {
    setGiftDialogVisible(true);
  };

  if (isPending) {
    return <LoadingIndicator />;
  }

  if (!data) {
    return null;
  }

  if (data.length === 0) {
    return (
      <View className='flex-1 justify-center items-center'>
        <Text className='text-2xl'>There is no recipe for this item</Text>
      </View>
    );
  }

  return (
    <View className='gap-4 mb-11 mt-4 my-6 px-4'>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <RecipeCard
            itemRecipe={item.itemRecipe}
            target={item.target}
            targetType={item.targetType}
            accountItems={accItems}
          />
        )}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View className='h-4' />}
      />
      <GiftDialog open={giftDialogVisible} onOpenChange={setGiftDialogVisible} curItem={curItem} />
    </View>
  );
}
