import { router } from 'expo-router';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Keyboard, SafeAreaView, TouchableWithoutFeedback, View } from 'react-native';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Text } from '~/components/ui/text';

type SignInFormData = {
  phone: string;
  password: string;
};

export default function SignIn() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    defaultValues: {
      phone: '',
      password: '',
    },
  });

  const onSubmit = (data: SignInFormData) => {
    console.log(data);
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
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    aria-labelledby='phone'
                    placeholder='+84123456789'
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    textContentType='telephoneNumber'
                    keyboardType='phone-pad'
                  />
                )}
                name='phone'
              />
              {errors.phone && <Text className='text-sm font-medium text-destructive'>This is required.</Text>}
            </View>
            <View>
              <Label nativeID='password' className='mb-2'>
                Password
              </Label>
              <Controller
                control={control}
                rules={{
                  required: 'Password is required',
                  minLength: {
                    value: 5,
                    message: 'Password must be at least 5 characters long',
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    aria-labelledby='password'
                    placeholder='*****'
                    onBlur={onBlur}
                    onChangeText={(text) => onChange(text.trim())}
                    value={value}
                    textContentType='password'
                    secureTextEntry
                  />
                )}
                name='password'
              />
              {errors.password && <Text className='text-sm font-medium text-destructive'>This is required.</Text>}
            </View>
          </View>
        </View>
        <View className='flex-1 justify-end gap-4'>
          <Button size='lg' onPress={handleSubmit(onSubmit)}>
            <Text>Sign in</Text>
          </Button>
          <View className='flex flex-row items-center justify-center'>
            <Text className='text-center text-foreground'>Don't have an account?</Text>
            <Button variant='link' size='sm' onPress={() => router.replace('sign-up')}>
              <Text className='text-primary underline'>Sign up</Text>
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
