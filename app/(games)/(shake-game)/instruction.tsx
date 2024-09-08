import { SafeAreaView, Text } from 'react-native';

const instruction = `1. Shake your phone to get a reward\n2. Shake it harder\n3. Shake it even harder\n4. Shake it the hardest\n5. Shake it like you mean it\n6. Shake it like you're angry\n7. Shake it like you're mad\n8. Shake it like you're crazy\n9. Shake it like you're insane\n10. Shake it like you're possessed`;

export default function Instruction() {
  return (
    <SafeAreaView className='flex flex-1 px-8 py-10'>
      <Text className='text-2xl font-semibold'>Instruction</Text>
      <Text className='text-lg'>{instruction}</Text>
    </SafeAreaView>
  );
}
