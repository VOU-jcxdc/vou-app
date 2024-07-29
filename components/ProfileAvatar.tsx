import { Text, View } from 'react-native';

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';

type ProfileAvatarProps = {
  uri: string;
  alt: string;
};

export default function ProfileAvatar({ uri, alt }: ProfileAvatarProps) {
  const fallback = alt.slice(0, 1).toUpperCase();

  return (
    <View>
      <Avatar className='h-40 w-40' alt={alt}>
        <AvatarImage source={{ uri: uri }} />
        <AvatarFallback className='bg-slate-400'>
          <Text className='text-6xl'>{fallback}</Text>
        </AvatarFallback>
      </Avatar>
    </View>
  );
}
