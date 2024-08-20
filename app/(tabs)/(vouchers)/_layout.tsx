import { Stack } from 'expo-router';

export default function VouchersLayout() {
  return (
    <Stack>
      <Stack.Screen
        name='index'
        options={{
          title: 'Vouchers',
        }}
      />
      <Stack.Screen
        name='gift-exchange'
        options={{
          title: 'QR Mã quà tặng',
        }}
      />
    </Stack>
  );
}
