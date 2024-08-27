import { useState } from 'react';
import { Image, ScrollView, Text, View } from 'react-native';

const apiURl = process.env.EXPO_PUBLIC_API_URL;

export default function ImageSlider({ images }: { images: string[] }) {
  const [active, setActive] = useState(0);
  const changeImage = ({ nativeEvent }: { nativeEvent: any }) => {
    const slide = Math.ceil(nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width);
    if (slide !== active) {
      setActive(slide);
    }
  };

  return (
    <View>
      <ScrollView
        className='h-full w-full object-cover'
        pagingEnabled
        horizontal
        onScroll={changeImage}
        showsHorizontalScrollIndicator={false}>
        {images.map((image, index) => (
          <Image key={index} className='h-full w-full object-cover' source={{ uri: `${apiURl}/files/${image}` }} />
        ))}
      </ScrollView>
      <View className='flex flex-row absolute self-center bottom-[-5]'>
        {images.map((image, index) => (
          <Text key={index} style={index === active ? { color: '#FFFFFF' } : { color: '#D6D6D6' }}>
            ⬤
          </Text>
        ))}
      </View>
    </View>
  );
}
