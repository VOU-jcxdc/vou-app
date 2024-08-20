import { useQuery } from '@tanstack/react-query';
import { FlatList, SafeAreaView, View } from 'react-native';
import { LoadingIndicator } from '~/components/LoadingIndicator';
import { Text } from '~/components/ui/text';
import VoucherCard from '~/components/VoucherCard';
import { fetchAcountVouchers } from '~/lib/api/api';

export default function Vouchers() {
  const { data, isPending } = useQuery({
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
        <Text>Tài khoản chưa có voucher nào</Text>
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
                id={voucher.id}
                name={voucher.name}
                description={voucher.description}
                brandId={voucher.brandId}
                duration={voucher.duration}
                assignedOn={item.assignedOn}
                usageMode={voucher.usageMode}
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
