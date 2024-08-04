import { Text, TextInputProps, View } from 'react-native';

import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';

type ProfileInputProps = {
  label: string;
  error?: string;
} & TextInputProps;

export default function ProfileInput({ label, error, value, readOnly = false, ...props }: ProfileInputProps) {
  return (
    <View>
      <View className='flex flex-row justify-between'>
        <Label nativeID='name'>{label}</Label>
        {error && <Text className='text-red-500'>{error}</Text>}
      </View>
      <Input maxLength={120} value={value} aria-labelledby='name' readOnly={readOnly} {...props} />
    </View>
  );
}
