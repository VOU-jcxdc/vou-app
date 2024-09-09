import { SafeAreaView, Text } from 'react-native';

const instruction =
  'Objective: Shake your device as many times as possible within the given time limit.\nGameplay:\n1. Players join the game and wait for the shake challenge to start.\n2. Once the game starts, players must shake their devices vigorously.\n3. The game will random the prize for the user.\nRules:\n1. Players must hold their devices securely to avoid dropping them.\n2. No external devices or tools are allowed to assist in shaking.';

export default function Instruction() {
  return (
    <SafeAreaView className='flex flex-1 px-8 py-10'>
      <Text className='text-2xl font-semibold'>Shake Game Instruction</Text>
      <Text className='text-lg'>{instruction}</Text>
    </SafeAreaView>
  );
}
