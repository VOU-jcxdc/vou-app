import { ActivityIndicator, Image, View } from 'react-native';
import { Dialog, DialogContent } from './ui/dialog';
import { Text } from './ui/text';

export default function SuccessDialog({
  open,
  setOpen,
  isPending,
  message,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
  isPending?: boolean;
  message: string;
}) {
  if (isPending) {
    return <ActivityIndicator size='large' />;
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='w-96'>
        {isPending ? (
          <ActivityIndicator size='large' />
        ) : (
          <View className='flex gap-5 items-center'>
            <View className=' flex items-center justify-center gap-2'>
              <Image
                className='rounded-full h-24 w-24'
                source={{
                  uri: 'https://cdn.vectorstock.com/i/500p/14/99/green-tick-marker-checkmark-circle-icon-vector-22691499.jpg',
                }}
              />
            </View>
            <View className='flex items-center'>
              <Text className='text-base text-center'>{message}</Text>
            </View>
          </View>
        )}
      </DialogContent>
    </Dialog>
  );
}
