import { zodResolver } from '@hookform/resolvers/zod';
import { RouteProp, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { router } from 'expo-router';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Keyboard, SafeAreaView, TouchableWithoutFeedback, View } from 'react-native';
import { z } from 'zod';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Text } from '~/components/ui/text';
import { useAuth } from '~/context/AuthContext';
import { formatPhoneNumber, formatPhoneNumberSubmit, phoneRegex } from '~/utils/PhoneUtils';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const signInFormSchema = z.object({
  phone: z.string().min(1, 'Phone number is required').regex(phoneRegex, 'Invalid phone format'),
  password: z.string().min(1, 'Password is required').min(5, 'Password must be at least 5 characters'),
});
type SignInFormData = z.infer<typeof signInFormSchema>;

type RouteParams = {
  SignIn: {
    uuid: string;
  };
};

const handleSignInResponse = (
  response: any,
  uuid: string,
  setAuthInfo: (token: string, clientId: string, role: string) => void,
  router: any
) => {
  if (response.data.statusCode === 200) {
    const { access_token } = response.data;
    setAuthInfo(access_token, uuid, 'player');
    router.replace('/(tabs)');
  }
};

export default function SignIn() {
  const { setAuthInfo } = useAuth();
  const route = useRoute<RouteProp<RouteParams, 'SignIn'>>();
  const { uuid } = route.params;

  const { control, handleSubmit } = useForm<SignInFormData>({
    defaultValues: {
      phone: '+84 ',
      password: '',
    },
    resolver: zodResolver(signInFormSchema),
  });

  const signInUser = async (data: SignInFormData) => {
    const response = await axios.post(`${apiUrl}/auth/sign-in`, data);
    return response;
  };

  const onSubmit = async (data: SignInFormData) => {
    let { phone } = data;
    phone = formatPhoneNumberSubmit(phone);
    console.log(JSON.stringify({ ...data, phone }));

    try {
      const response = await signInUser({ ...data, phone });
      handleSignInResponse(response, uuid, setAuthInfo, router);
    } catch (error) {
      console.error('Error during sign-in:', error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className='mx-4 flex-1'>
        <Text className='mb-4 mt-14 text-3xl font-medium'>Welcome back</Text>
        <View className='my-6'>
          <View className='flex flex-col gap-4'>
            <View>
              <Label nativeID='phone' className='mb-2'>
                Phone Number
              </Label>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                  <>
                    <Input
                      aria-labelledby='phone'
                      placeholder='+84 123456789'
                      onBlur={onBlur}
                      onChangeText={(text) => onChange(formatPhoneNumber(text))}
                      value={value}
                      textContentType='telephoneNumber'
                      keyboardType='phone-pad'
                    />
                    {error && <Text className='text-sm font-medium text-destructive'>{error.message}</Text>}
                  </>
                )}
                name='phone'
              />
            </View>
            <View>
              <Label nativeID='password' className='mb-2'>
                Password
              </Label>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                  <>
                    <Input
                      aria-labelledby='password'
                      placeholder='*****'
                      onBlur={onBlur}
                      onChangeText={(text) => onChange(text.trim())}
                      value={value}
                      textContentType='password'
                      secureTextEntry
                    />
                    {error && <Text className='text-sm font-medium text-destructive'>{error.message}</Text>}
                  </>
                )}
                name='password'
              />
            </View>
          </View>
        </View>
        <View className='flex-1 justify-end gap-4'>
          <Button size='lg' onPress={handleSubmit(onSubmit)}>
            <Text>Sign in</Text>
          </Button>
          <View className='flex flex-row items-center justify-center'>
            <Text className='text-center text-foreground'>Don't have an account?</Text>
            <Button variant='link' size='sm' onPress={() => router.replace('/sign-up')}>
              <Text className='text-primary underline'>Sign up</Text>
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
