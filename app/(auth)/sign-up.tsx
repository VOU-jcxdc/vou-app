import { router } from 'expo-router';
import React from 'react';
import { SafeAreaView, View, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Text } from '~/components/ui/text';
import { Controller, useForm } from 'react-hook-form';
import { formatDOB } from '~/utils/DateTimeUtils';
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group';
// import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SignUpFormData = {
  phone: string;
  password: string;
  role: string;
  username: string;
  data: {
    dob: string;
    email: string;
    gender: string;
  };
};

// Define the radio button options
const genderOptions = [
  {
    id: '1', // unique id for each option
    value: 'female',
  },
  {
    id: '2',
    value: 'male',
  },
  {
    id: '3',
    value: 'other',
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
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    defaultValues: {
      phone: '',
      password: '',
      role: 'player',
      username: '',
      data: {
        dob: '',
        email: '',
        gender: '',
      },
    },
  });
  // const [confirm, setConfirm] = React.useState<FirebaseAuthTypes.ConfirmationResult | null>(null);

  const onSubmit = (data: SignUpFormData) => {
    console.log({ ...data, data: { ...data.data, dob: new Date(data.data.dob) } });
    const phone = data.phone;
    router.push(`verify-otp?phone=${encodeURIComponent(phone)}`);
  };

  // const signInWithPhoneNumber = async (phone: string) => {
  //   try {
  //     const confirmation = await auth().signInWithPhoneNumber(phone);
  //     setConfirm(confirmation);
  //   } catch (error) {
  //     console.error('Phone authentication error:', error);
  //   }
  // };

  // const confirmCode = async (code: string) => {
  //   try {
  //     const userCredential = await confirm?.confirm(code);
  //     const user = userCredential?.user;

  //     if (user) {
  //       await AsyncStorage.setItem('isAuthenticated', 'true');
  //       router.push('(tabs)');
  //     }
  //   } catch (error) {
  //     console.error('Phone code confirmation error:', error);
  //   }
  // };

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
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    aria-labelledby='username'
                    placeholder='John Doe'
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    textContentType='name'
                  />
                )}
                name='username'
              />
              {errors.username && <Text className='text-sm font-medium text-destructive'>This is required.</Text>}
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
            <View>
              <Label nativeID='dob' className='mb-2'>
                Date of Birth
              </Label>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    aria-labelledby='dob'
                    placeholder='DD-MM-YYYY'
                    onBlur={onBlur}
                    onChangeText={(text) => onChange(formatDOB(text))}
                    value={value}
                    textContentType='none'
                    keyboardType='number-pad'
                  />
                )}
                name='data.dob'
              />
              {errors.data?.dob && <Text className='text-sm font-medium text-destructive'>This is required.</Text>}
            </View>
            <View>
              <Label nativeID='email' className='mb-2'>
                Email
              </Label>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    aria-labelledby='email'
                    placeholder='example@gmail.com'
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    textContentType='emailAddress'
                    keyboardType='email-address'
                  />
                )}
                name='data.email'
              />
              {errors.data?.email && <Text className='text-sm font-medium text-destructive'>This is required.</Text>}
            </View>
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
              <Label nativeID='gender' className='mb-2'>
                Gender
              </Label>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <RadioGroup value={value} onValueChange={onChange} className='flex flex-row gap-3'>
                    {genderOptions.map((option) => (
                      <RadioGroupItemWithLabel
                        key={option.id}
                        value={option.value}
                        onLabelPress={() => onChange(option.value)}
                      />
                    ))}
                  </RadioGroup>
                )}
                name='data.gender'
              />
              {errors.data?.gender && <Text className='text-sm font-medium text-destructive'>This is required.</Text>}
            </View>
          </View>
        </View>
        <View className='flex-1 justify-end gap-4'>
          <Button size='lg' onPress={handleSubmit(onSubmit)}>
            <Text>Sign up</Text>
          </Button>
          <View className='flex flex-row items-center justify-center'>
            <Text className='text-center text-foreground'>Already have an account? </Text>
            <Button variant='link' size='sm' onPress={() => router.replace('sign-in')}>
              <Text className='text-primary underline'>Sign in</Text>
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
