import React from 'react';
import { FlatList, SafeAreaView, Text, View } from 'react-native';
import ItemCard from '~/components/ItemCard';
import { Button } from '~/components/ui/button';

const items = [
  {
    id: '1',
    name: 'Item 1',
    eventId: 1,
    image: 'https://picsum.photos/id/1/200/300',
  },
  {
    id: '2',
    name: 'Item 2',
    eventId: 1,
    image: 'https://picsum.photos/id/2/200/300',
  },
  {
    id: '3',
    name: 'Item 3',
    eventId: 1,
    image: 'https://picsum.photos/id/3/200/300',
  },
  {
    id: '4',
    name: 'Item 4',
    eventId: 1,
    image: 'https://picsum.photos/id/4/200/300',
  },
  {
    id: '5',
    name: 'Item 5',
    eventId: 1,
    image: 'https://picsum.photos/id/5/200/300',
  },
  {
    id: '6',
    name: 'Item 6',
    eventId: 1,
    image: 'https://picsum.photos/id/6/200/300',
  },
  {
    id: '7',
    name: 'Item 7',
    eventId: 1,
    image: 'https://picsum.photos/id/7/200/300',
  },
  {
    id: '8',
    name: 'Item 8',
    eventId: 1,
    image: 'https://picsum.photos/id/8/200/300',
  },
  {
    id: '9',
    name: 'Item 9',
    eventId: 1,
    image: 'https://picsum.photos/id/9/200/300',
  },
  {
    id: '10',
    name: 'Item 10',
    eventId: 1,
    image: 'https://picsum.photos/id/10/200/300',
  },
];

export default function Inventory() {
  return (
    <SafeAreaView className='m-6 h-full gap-4'>
      <View className='gap-4'>
        <Text className='text-xl font-bold'>Exchange Voucher</Text>
        <Text>Vouchers</Text>
        <Button>
          <Text className='text-white'>Redeem</Text>
        </Button>
      </View>
      <View className='flex-1 gap-4'>
        <Text className='text-xl font-bold'>Items</Text>
        <FlatList
          data={items}
          numColumns={2}
          renderItem={({ item }) => {
            return <ItemCard {...item} />;
          }}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
        />
      </View>
    </SafeAreaView>
  );
}
