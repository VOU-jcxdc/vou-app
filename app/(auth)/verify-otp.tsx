import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { RouteProp, useRoute } from '@react-navigation/native';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { z } from 'zod';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Text } from '~/components/ui/text';
import { doPost } from '~/utils/APIRequest';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const verifyOTPFormSchema = z.object({
  otp: z.string().min(1, 'OTP is required'),
});
type VerifyOTPFormData = z.infer<typeof verifyOTPFormSchema>;

type RouteParams = {
  VerifyOTP: {
    data: string;
  };
};

export default function VerifyOTP() {
  const { control, handleSubmit } = useForm<VerifyOTPFormData>({
    defaultValues: {
      otp: '',
    },
  });

  const route = useRoute<RouteProp<RouteParams, 'VerifyOTP'>>();
  const { data } = route.params;
  const { phone } = JSON.parse(data);

  const inputRefs = useRef<TextInput[]>([]);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [confirm, setConfirm] = useState<FirebaseAuthTypes.ConfirmationResult | null>(null);

  useEffect(() => {
    // Auto-focus the first input when the component mounts
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
      setFocusedIndex(0);
    }

    signUpWithPhoneNumber(phone);
  }, []);

  const onSubmit = (data: VerifyOTPFormData) => {
    confirmOTP(data.otp);
  };

  const handleTextChange = (text: string, index: number, onChange: (...event: any[]) => void) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text !== '' && index < otp.length - 1) {
      // Move focus to the next cell if text is entered
      inputRefs.current[index + 1].focus();
      setFocusedIndex(index + 1);
    }

    onChange(newOtp.join(''));
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      // Move focus to the previous cell if backspace is pressed and current cell is empty
      inputRefs.current[index - 1].focus();
      inputRefs.current[index - 1].setSelection(otp[index - 1].length, otp[index - 1].length);
      setFocusedIndex(index - 1);
    }
  };

  const handleOutsidePress = () => {
    Keyboard.dismiss();
    if (focusedIndex !== null && inputRefs.current[focusedIndex]) {
      inputRefs.current[focusedIndex].blur();
      setFocusedIndex(null);
    }
  };

  const signUpWithPhoneNumber = async (phoneNumber: string) => {
    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      setConfirm(confirmation);
    } catch (error) {
      console.error('Error sending OTP: ', error);
    }
  };

  const signUpUser = async (data: string) => {
    await doPost(`${apiUrl}/auth/sign-up`, JSON.parse(data));
  };

  const confirmOTP = async (otp: string) => {
    try {
      const userCredential = await confirm?.confirm(otp);
      const user = userCredential?.user;

      const userDocument = await firestore().collection('users').doc(user?.uid).get();
      if (!userDocument.exists) {
        await firestore().collection('users').doc(user?.uid).set({
          phoneNumber: user?.phoneNumber,
        });
      }

      if (user) {
        await signUpUser(data);
        router.replace('/sign-in');
      }
    } catch (error) {
      console.error('Error confirming OTP: ', error);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className='flex-1'>
      <TouchableWithoutFeedback onPress={handleOutsidePress}>
        <SafeAreaView className='m-4 flex-1'>
          <Text className='text-center text-lg'>Please enter the verification code sent to {phone}</Text>
          <View className='my-6'>
            <View className='flex flex-col gap-4'>
              <View>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur }, fieldState: { error } }) => (
                    <>
                      <View className='flex-row justify-between'>
                        {otp.map((_, index) => (
                          <Input
                            key={index}
                            ref={(ref) => (inputRefs.current[index] = ref!)}
                            className={`w-14 text-center text-lg rounded-xl bg-background ${focusedIndex === index && 'border-2 border-primary'}`}
                            onBlur={onBlur}
                            value={otp[index]}
                            onChangeText={(text) => handleTextChange(text, index, onChange)}
                            keyboardType='number-pad'
                            textContentType='oneTimeCode'
                            onKeyPress={(e) => handleKeyPress(e, index)}
                            onFocus={() => setFocusedIndex(index)}
                          />
                        ))}
                      </View>
                      {error && <Text className='text-sm font-medium text-destructive'>This is required.</Text>}
                    </>
                  )}
                  name='otp'
                />
              </View>
            </View>
          </View>
          <View className='flex-1 justify-end gap-3'>
            <Button onPress={handleSubmit(onSubmit)} className='w-full'>
              <Text>Submit</Text>
            </Button>
            <View className='flex flex-row items-center justify-center'>
              <Text className='text-center text-foreground'>Didn't receive an OTP?</Text>
              <Button variant='link' size='sm' onPress={() => signUpWithPhoneNumber(phone)}>
                <Text className='text-primary'>Resend OTP</Text>
              </Button>
            </View>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
