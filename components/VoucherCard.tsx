import Ionicons from '@expo/vector-icons/Ionicons';
import Clipboard from '@react-native-clipboard/clipboard';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Toast from 'react-native-toast-message';
import { updateUsedVoucher } from '~/lib/api/api';
import { AccountsVouchers, Voucher, VoucherUsageMode } from '~/lib/interfaces';
import { cn } from '~/lib/utils';
import { getDiff } from '~/utils/DateTimeUtils';
import SuccessDialog from './SuccessDialog';
import { Button } from './ui/button';
import { Card } from './ui/card';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from './ui/dialog';
import { Text } from './ui/text';

const apiURl = process.env.EXPO_PUBLIC_API_URL;

type VoucherCardProps = Pick<Voucher, 'id' | 'name' | 'description' | 'duration' | 'usageMode' | 'code'> &
  Partial<Pick<AccountsVouchers, 'assigenedOn' | 'quantity'>> & {
    isAssigned?: boolean;
    brandInfo?: { name: string; bucketId: string };
    onVoucherUsed?: () => void;
  };

function DurationText({ assigned_on, duration }: { assigned_on: string; duration: number }) {
  const { date, diff, diffDays, diffHours } = getDiff(assigned_on, duration);
  if (diff > 0) {
    if (diffDays > 5) {
      return <Text className='font-medium text-sm'>{'EXP: ' + date.toLocaleDateString()}</Text>;
    } else
      return (
        <Text className='text-destructive'>
          {diffHours > 24 ? `${diffDays} days left` : `${diffHours} hours left`}{' '}
        </Text>
      );
  } else {
    return <Text className='text-destructive'>Expired</Text>;
  }
}

export default function VoucherCard({
  id,
  name,
  description,
  code,
  brandInfo,
  duration,
  assigenedOn,
  quantity,
  usageMode,
  isAssigned = true,
  onVoucherUsed,
}: VoucherCardProps) {
  const queryClient = useQueryClient();
  const usedVoucherMutation = useMutation({
    mutationFn: updateUsedVoucher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['account-vouchers', id as string] });
      Toast.show({
        type: 'success',
        text1: 'Voucher used successfully',
        visibilityTime: 100,
      });
      onVoucherUsed?.();
    },
  });
  const [open, setOpen] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);

  const handleDone = () => {
    usedVoucherMutation.mutate({ id });
    setOpenSuccess(true);
  };

  const copyToClipboard = () => {
    Clipboard.setString(code);
  };

  const imageUri =
    brandInfo && brandInfo.bucketId
      ? `${apiURl}/files/${brandInfo.bucketId}?${new Date().getTime()}`
      : 'https://picsum.photos/id/1/200/300';

  const usageModeTextClsName = cn('bg-secondary px-3 py-1 rounded-2xl self-center text-sm', !isAssigned && 'mt-2');

  return (
    <Card className='h-36'>
      <View className='flex-row gap-4 items-center'>
        <View className='h-36 w-36 bg-slate-50 flex items-center justify-center gap-2'>
          <Image className='rounded-full h-12 w-12' source={{ uri: imageUri }} />
          <Text className='text-base font-semibold'>{brandInfo?.name || 'Brand name'}</Text>
        </View>
        <View className='flex-1'>
          <View className='flex flex-row justify-between'>
            <Text className='text-xl font-bold'>{name}</Text>
            {quantity && <Text className='bg-slate-800 font-medium color-white px-2'>x{quantity}</Text>}
          </View>
          <Text className='text-base'>{description}</Text>
          {assigenedOn && <DurationText assigned_on={assigenedOn} duration={duration} />}
          {!isAssigned && quantity == 0 && <Text className='text-secondary'>Ưu đãi đã hết</Text>}
          <View className='flex flex-row justify-between'>
            <Text className={usageModeTextClsName}>{usageMode}</Text>

            {isAssigned &&
              (usageMode == VoucherUsageMode.OFFLINE ? (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant='ghost'>
                      <Text className='text-primary font-medium'>Đổi quà</Text>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className='w-96'>
                    <View className='flex gap-5 items-center'>
                      <View className=' flex items-center justify-center gap-2'>
                        <Image
                          className='rounded-full h-24 w-24'
                          source={{
                            uri: imageUri,
                          }}
                        />
                      </View>
                      <View className='flex items-center'>
                        <Text className='text-base'>{brandInfo?.name || 'Brand name'}</Text>
                        <View className='flex flex-row items-center gap-2'>
                          <Text className='text-lg font-medium'>{code}</Text>
                          <TouchableOpacity onPress={copyToClipboard}>
                            <Ionicons name='copy-outline' size={20} />
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View className='p-5 rounded border-slate-200 border'>
                        <QRCode value={code} />
                      </View>
                    </View>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button onPress={handleDone}>
                          <Text>Done</Text>
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              ) : (
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button variant='ghost'>
                      <Text className='text-primary font-medium'>Đổi quà</Text>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className='w-96'>
                    <DialogHeader>
                      <DialogDescription>
                        Quà chỉ thực hiện đổi 1 lần, vui lòng copy mã quà để sử dụng sau
                      </DialogDescription>
                    </DialogHeader>
                    <View className='flex gap-5 items-center'>
                      <View className=' flex items-center justify-center gap-2'>
                        <Image
                          className='rounded-full h-24 w-24'
                          source={{
                            uri: 'https://seeklogo.com/images/G/grab-logo-7020E74857-seeklogo.com.png',
                          }}
                        />
                      </View>
                      <View className='flex items-center'>
                        <Text className='text-base'>Grab</Text>
                        <View className='flex flex-row items-center gap-2'>
                          <Text className='text-lg font-medium'>{code}</Text>
                          <TouchableOpacity
                            onPress={() => {
                              copyToClipboard();
                              handleDone();
                              setOpen(false);
                            }}>
                            <Ionicons name='copy-outline' size={20} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </DialogContent>
                </Dialog>
              ))}
          </View>
        </View>
      </View>
      <SuccessDialog open={openSuccess} setOpen={setOpenSuccess} message='Sử dụng voucher thành công' />
    </Card>
  );
}
