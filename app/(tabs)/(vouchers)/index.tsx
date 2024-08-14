import { FlatList, Image, SafeAreaView, Text, View } from 'react-native';
import { Button } from '~/components/ui/button';
import { Card } from '~/components/ui/card';

const vouchers = [
  {
    id: '1',
    name: 'Giảm 10%',
    description: 'Tối đa 30K đơn từ 75k',
    brand: {
      name: 'Kai Coffee',
      image: 'https://picsum.photos/id/1/200/300',
    },
    assigned_on: '2024-08-15',
    duration: 86400,
  },
  {
    id: '2',
    name: 'Voucher 2',
    description: 'This is a description for voucher 2',
    brand: {
      name: 'Brand 2',
      image: 'https://picsum.photos/id/2/200/300',
    },
    assigned_on: '2024-08-15',
    duration: 172800,
  },
  {
    id: '3',
    name: 'Voucher 3',
    description: 'This is a description for voucher 3',
    brand: {
      name: 'Brand 3',
      image: 'https://picsum.photos/id/3/200/300',
    },
    assigned_on: '2024-08-15',
    duration: 259200,
  },
  {
    id: '4',
    name: 'Voucher 4',
    description: 'This is a description for voucher 4',
    brand: {
      name: 'Brand 4',
      image: 'https://picsum.photos/id/4/200/300',
    },
    assigned_on: '2024-08-15',
    duration: 345600,
  },
  {
    id: '5',
    name: 'Voucher 5',
    description: 'This is a description for voucher 5',
    brand: {
      name: 'Brand 5',
      image: 'https://picsum.photos/id/5/200/300',
    },
    assigned_on: '2024-08-15',
    duration: 432000,
  },
  {
    id: '6',
    name: 'Voucher 6',
    description: 'This is a description for voucher 6',
    brand: {
      name: 'Brand 6',
      image: 'https://picsum.photos/id/6/200/300',
    },
    assigned_on: '2024-08-15',
    duration: 518400,
  },
  {
    id: '7',
    name: 'Voucher 7',
    description: 'This is a description for voucher 7',
    brand: {
      name: 'Brand 7',
      image: 'https://picsum.photos/id/7/200/300',
    },
    assigned_on: '2024-08-15',
    duration: 604800,
  },
  {
    id: '8',
    name: 'Voucher 8',
    description: 'This is a description for voucher 8',
    brand: {
      name: 'Brand 8',
      image: 'https://picsum.photos/id/8/200/300',
    },
    assigned_on: '2024-08-15',
    duration: 691200,
  },
];

function DurationText({ assigned_on, duration }: { assigned_on: string; duration: number }) {
  const date = new Date(assigned_on);
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

export default function Vouchers() {
  return (
    <SafeAreaView className='mx-4 my-6 h-full gap-4'>
      <View className='gap-4 mb-11'>
        <FlatList
          data={vouchers}
          renderItem={({ item }) => (
            <Card className='h-36'>
              <View className='flex-row gap-4 items-center'>
                <View className='h-36 w-36 bg-slate-50 flex items-center justify-center gap-2'>
                  <Image className='rounded-full h-12 w-12' source={{ uri: item.brand.image }} />
                  <Text className='text-base font-semibold'>{item.brand.name}</Text>
                </View>
                <View className='flex-1'>
                  <Text className='text-xl font-bold'>{item.name}</Text>
                  <Text className='text-base'>{item.description}</Text>
                  <DurationText assigned_on={item.assigned_on} duration={item.duration} />
                  <Button variant='ghost' className='self-end'>
                    <Text className='text-primary font-medium'>Dùng ngay</Text>
                  </Button>
                </View>
              </View>
            </Card>
          )}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View className='h-4' />}
        />
      </View>
    </SafeAreaView>
  );
}
