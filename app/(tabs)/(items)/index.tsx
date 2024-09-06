import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { FlatList, Pressable, SafeAreaView, View } from 'react-native';
import Toast from 'react-native-toast-message';
import ItemCard from '~/components/ItemCard';
import { LoadingIndicator } from '~/components/LoadingIndicator';
import { Text } from '~/components/ui/text';
import { fetchAccountItems } from '~/lib/api/api';

export default function Gifts() {
  const { data, isPending } = useQuery({
    queryKey: ['account-items'],
    queryFn: fetchAccountItems,
  });

  if (isPending) {
    return <LoadingIndicator />;
  }

  if (!data) {
    return null;
  }

  if (data.length === 0) {
    return (
      <View className='flex-1 justify-center items-center'>
        <Text className='text-2xl'>You currently have no items</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className='mx-4 my-6 h-full gap-4 items-center w-full'>
      <View className='gap-4 mb-11 w-full pr-8'>
        <FlatList
          data={data}
          renderItem={({ item }) => {
            const itemInfo = item.item;
            return (
              <Pressable
                className='flex-1'
                onPress={() =>
                  router.push({
                    pathname: `/item-details/[id]`,
                    params: { id: itemInfo.id, accountItems: JSON.stringify(data) },
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
      </View>
      <Toast />
    </SafeAreaView>
  );
}
