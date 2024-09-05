import { useQuery } from '@tanstack/react-query';
import { FlatList, SafeAreaView, View } from 'react-native';
import { LoadingIndicator } from '~/components/LoadingIndicator';
import { Text } from '~/components/ui/text';
import VoucherCard from '~/components/VoucherCard';
import { fetchAcountVouchers } from '~/lib/api/api';

export default function Vouchers() {
  const { data, isPending, refetch } = useQuery({
    queryKey: ['account-vouchers'],
    queryFn: fetchAcountVouchers,
  });

  if (!data) {
    return null;
  }

  if (isPending) {
    return <LoadingIndicator />;
  }

  if (data.length === 0) {
    return (
      <View className='flex-1 justify-center items-center'>
        <Text className='text-2xl'>You currently have no vouchers</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className='mx-4 my-6 h-full gap-4'>
      <View className='gap-4 mb-11'>
        <FlatList
          data={data}
          renderItem={({ item }) => {
            const { voucher } = item;
            return (
              <VoucherCard
                id={item.id}
                name={voucher.name}
                description={voucher.description}
                code={voucher.code}
                duration={voucher.duration}
                assigenedOn={item.assigenedOn}
                quantity={item.quantity}
                brandInfo={voucher.brandInfo}
                usageMode={voucher.usageMode}
                onVoucherUsed={refetch}
              />
            );
          }}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View className='h-4' />}
        />
      </View>
    </SafeAreaView>
  );
}
