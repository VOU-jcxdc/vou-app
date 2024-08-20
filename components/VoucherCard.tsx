import { router } from 'expo-router';
import { Image, View } from 'react-native';
import { AccountsVouchers, BrandInfo, User, Voucher } from '~/lib/interfaces';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Text } from './ui/text';

type VoucherCardProps = Pick<Voucher, 'id' | 'name' | 'description' | 'duration' | 'brandId' | 'usageMode'> &
  Partial<Pick<AccountsVouchers, 'assignedOn'>> & {
    showButton?: boolean;
  };

function DurationText({ assigned_on, duration }: { assigned_on: string; duration: number }) {
  const date = new Date(assigned_on.replace(' ', 'T'));
  date.setSeconds(date.getSeconds() + duration);
  // count hours to expired
  const diff = date.getTime() - Date.now();
  const diffHours = Math.floor(diff / 3600000);
  const diffDays = Math.floor(diff / 86400000);
  if (diff > 0) {
    if (diffDays > 5) {
      return <Text className='font-medium text-sm'>{'HSD: ' + date.toLocaleDateString()}</Text>;
    } else
      return (
        <Text className='text-destructive'>{diffHours > 24 ? `Còn ${diffDays} ngày` : `Còn ${diffHours} giờ`} </Text>
      );
  }
}

export default function VoucherCard({
  id,
  name,
  description,
  brandId,
  duration,
  assignedOn,
  usageMode,
  showButton = true,
}: VoucherCardProps) {
  const brand: Partial<BrandInfo> & Pick<User, 'bucketId'> = {
    name: 'Kai Coffee',
    bucketId: 'https://picsum.photos/id/1/200/300',
  };

  const handleGiftExchange = () => {
    router.push({
      pathname: '/gift-exchange',
      params: { id },
    });
  };

  return (
    <Card className='h-36'>
      <View className='flex-row gap-4 items-center'>
        <View className='h-36 w-36 bg-slate-50 flex items-center justify-center gap-2'>
          <Image
            className='rounded-full h-12 w-12'
            source={{ uri: brand.bucketId || 'https://picsum.photos/id/1/200/300' }}
          />
          <Text className='text-base font-semibold'>{brand.name}</Text>
        </View>
        <View className='flex-1'>
          <Text className='text-xl font-bold'>{name}</Text>
          <Text className='text-base'>{description}</Text>
          {assignedOn && <DurationText assigned_on={assignedOn} duration={duration} />}
          <View className='flex flex-row justify-between'>
            <Text className='bg-secondary px-3 py-1 rounded-2xl self-center text-sm'>{usageMode}</Text>
            {showButton && (
              <Button variant='ghost' onPress={handleGiftExchange}>
                <Text className='text-primary font-medium'>Đổi quà</Text>
              </Button>
            )}
          </View>
        </View>
      </View>
    </Card>
  );
}
