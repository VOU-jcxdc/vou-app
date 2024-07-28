import { useRoute, RouteProp } from '@react-navigation/native';
import { Controller, useForm } from 'react-hook-form';
import { View, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Text } from '~/components/ui/text';
import { Keyboard } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native';
import { router } from 'expo-router';

type VerifyOTPFormData = {
  otp: string;
};

type RouteParams = {
  VerifyOTP: {
    phone: string;
  };
};

export default function VerifyOTP() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyOTPFormData>({
    defaultValues: {
      otp: '',
    },
  });

  const route = useRoute<RouteProp<RouteParams, 'VerifyOTP'>>();
  const { phone } = route.params;

  const onSubmit = (data: VerifyOTPFormData) => {
    console.log(data);
    router.replace('(tabs)');
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className='flex-1'>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView className='m-4 flex-1'>
          <Text className='text-center text-lg'>Please enter the verification code sent to {phone}</Text>
          <View className='my-6'>
            <View className='flex flex-col gap-4'>
              <View>
                <Label nativeID='otp' className='mb-2'>
                  OTP
                </Label>
                <Controller
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      aria-labelledby='otp'
                      placeholder='123456'
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      textContentType='oneTimeCode'
                      keyboardType='number-pad'
                    />
                  )}
                  name='otp'
                />
                {errors.otp && <Text className='text-sm font-medium text-destructive'>This is required.</Text>}
              </View>
            </View>
          </View>
          <View className='flex-1 justify-end'>
            <Button onPress={handleSubmit(onSubmit)} className='w-full'>
              <Text>Submit</Text>
            </Button>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
