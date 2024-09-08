import { useQuery } from '@tanstack/react-query';
import { fetchFile } from '~/lib/api/api';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const useFileQuery = (image: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ['file', image],
    queryFn: fetchFile,
  });

  const imageUri = data ? `${apiUrl}/files/${image}?${new Date().getTime()}` : 'https://picsum.photos/id/1/200/300';

  return { imageUri, isLoading };
};

export default useFileQuery;
