import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Keyboard, SafeAreaView, TouchableWithoutFeedback, View } from 'react-native';
import { z } from 'zod';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group';
import { Text } from '~/components/ui/text';

import { Gender } from '~/lib/types/enum';
import { dateRegex, formatDOB } from '~/utils/DateTimeUtils';
import { formatPhoneNumber, formatPhoneNumberSubmit } from '~/utils/PhoneUtils';

const signUpFormSchema = z
  .object({
    phone: z.string().min(1, 'Phone number is required'),
    password: z.string().min(1, 'Password is required').min(5, 'Password must be at least 5 characters'),
    confirmPass: z.string().min(1, 'Confirm password is required'),
    role: z.string(),
    username: z.string().min(1, 'Username is required'),
    email: z.string().min(1, 'Email is required').email('Invalid email format'),
    data: z.object({
      dob: z
        .string()
        .min(1, 'Date of birth is required')
        .refine((val) => dateRegex.test(val), {
          message: 'Invalid date format, must be YYYY-MM-DD',
        }),
      gender: z.enum(Object.values(Gender) as [Gender, ...Gender[]]),
    }),
  })
  .refine((data) => data.password === data.confirmPass, { message: 'Passwords do not match', path: ['confirmPass'] });
type SignUpFormData = z.infer<typeof signUpFormSchema>;

// Define the radio button options
const genderOptions = [
  {
    id: '1', // unique id for each option
    value: Gender.FEMALE,
  },
  {
    id: '2',
    value: Gender.MALE,
  },
];

function RadioGroupItemWithLabel({ value, onLabelPress }: { value: string; onLabelPress: () => void }) {
  return (
    <View className={'flex-row items-center gap-2'}>
      <RadioGroupItem aria-labelledby={`label-for-${value}`} value={value} />
      <Label nativeID={`label-for-${value}`} onPress={onLabelPress} className='capitalize'>
        {value}
      </Label>
    </View>
  );
}

export default function SignUp() {
  const { control, handleSubmit } = useForm<SignUpFormData>({
    defaultValues: {
      phone: '+84 ',
      password: '',
      role: 'player',
      username: '',
      email: '',
      data: {
        dob: '',
        gender: Gender.FEMALE,
      },
    },
    resolver: zodResolver(signUpFormSchema),
  });

  const onSubmit = (user: SignUpFormData) => {
    const { confirmPass, data, phone: rawPhone, ...rest } = user;
    const phone = formatPhoneNumberSubmit(rawPhone);
    const formattedData = { ...data, dob: new Date(data.dob) };

    router.push({ pathname: '/verify-otp', params: { data: JSON.stringify({ ...rest, phone, data: formattedData }) } });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className='mx-4 flex-1'>
        <Text className='mb-4 mt-14 text-3xl font-medium'>Hello new friend!</Text>
        <View className='my-6'>
          <View className='flex flex-col gap-4'>
            <View>
              <Label nativeID='username' className='mb-2'>
                Username
              </Label>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                  <>
                    <Input
                      aria-labelledby='username'
                      placeholder='John Doe'
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      textContentType='name'
                    />
                    {error && <Text className='text-sm font-medium text-destructive'>{error.message}</Text>}
                  </>
                )}
                name='username'
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
            <View>
              <Label nativeID='confirm-password' className='mb-2'>
                Confirm Password
              </Label>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                  <>
                    <Input
                      aria-labelledby='confirm-password'
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
                name='confirmPass'
              />
            </View>
            <View>
              <Label nativeID='dob' className='mb-2'>
                Date of Birth
              </Label>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                  <>
                    <Input
                      aria-labelledby='dob'
                      placeholder='YYYY-MM-DD'
                      onBlur={onBlur}
                      onChangeText={(text) => onChange(formatDOB(text))}
                      value={value}
                      textContentType='none'
                      keyboardType='number-pad'
                    />
                    {error && <Text className='text-sm font-medium text-destructive'>{error.message}</Text>}
                  </>
                )}
                name='data.dob'
              />
            </View>
            <View>
              <Label nativeID='email' className='mb-2'>
                Email
              </Label>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                  <>
                    <Input
                      aria-labelledby='email'
                      placeholder='example@gmail.com'
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      textContentType='emailAddress'
                      keyboardType='email-address'
                    />
                    {error && <Text className='text-sm font-medium text-destructive'>{error.message}</Text>}
                  </>
                )}
                name='email'
              />
            </View>
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
              <Label nativeID='gender' className='mb-2'>
                Gender
              </Label>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                  <>
                    <RadioGroup value={value} onValueChange={onChange} className='flex flex-row gap-3'>
                      {genderOptions.map((option) => (
                        <RadioGroupItemWithLabel
                          key={option.id}
                          value={option.value}
                          onLabelPress={() => onChange(option.value)}
                        />
                      ))}
                    </RadioGroup>
                    {error && <Text className='text-sm font-medium text-destructive'>{error.message}</Text>}
                  </>
                )}
                name='data.gender'
              />
            </View>
          </View>
        </View>
        <View className='flex-1 justify-end gap-4'>
          <Button size='lg' onPress={handleSubmit(onSubmit)}>
            <Text>Sign up</Text>
          </Button>
          <View className='flex flex-row items-center justify-center'>
            <Text className='text-center text-foreground'>Already have an account? </Text>
            <Button variant='link' size='sm' onPress={() => router.replace('/sign-in')}>
              <Text className='text-primary underline'>Sign in</Text>
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
