import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { FlatList, Pressable, SafeAreaView, View } from 'react-native';
import Toast from 'react-native-toast-message';
import GiftDialog from '~/components/GiftDialog';
import ItemCard from '~/components/ItemCard';
import { LoadingIndicator } from '~/components/LoadingIndicator';
import { fetchEventItems } from '~/lib/api/api';
import { Item } from '~/lib/interfaces';

export default function Inventory() {
  const { eventId } = useLocalSearchParams();
  const [open, setOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<Item>();
  const { data, isLoading } = useQuery({
    queryKey: ['inventory', eventId as string],
    queryFn: fetchEventItems,
  });

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <SafeAreaView className='m-6 h-full gap-4'>
      <View className='flex-1 gap-4'>
        <FlatList
          data={data}
          numColumns={2}
          renderItem={({ item }) => {
            if (!item.quantity) return null;
            return (
              <Pressable
                className='flex-1'
                onPress={() => {
                  setSelectedItem(item);
                  setOpen(true);
                }}>
                <ItemCard {...item} />
              </Pressable>
            );
          }}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View className='h-4' />}
          columnWrapperClassName='gap-4'
        />
      </View>
      {selectedItem && (
        <GiftDialog
          open={open}
          onOpenChange={setOpen}
          curItem={selectedItem}
          title={`Request for ${selectedItem.name}`}
          description={`Find and choose your friend to request them for ${selectedItem.name}.`}
          type='request'
        />
      )}
      <Toast />
    </SafeAreaView>
  );
}
