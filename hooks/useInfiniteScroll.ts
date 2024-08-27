import { useInfiniteQuery } from '@tanstack/react-query';
import _ from 'lodash';
import { useCallback, useMemo, useState } from 'react';

type Params<F> = {
  key: string;
  fetcher: ({ pageParam }: { pageParam: number }) => Promise<any>;
};

export const useInfiniteScroll = <F = object>({ key, fetcher }: Params<F>) => {
  const queryKey = [key, ..._.values<string | string[]>(_.omitBy({}, _.isEmpty))].filter(
    (c) => Boolean(c) && !_.isEmpty(c)
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const queryFn = fetcher;
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage, refetch } = useInfiniteQuery({
    queryKey,
    queryFn,
    initialPageParam: 0,
    getNextPageParam: (lastPage, __, lastPageParam) => {
      if ((lastPage.events?.length ?? 0) < lastPage.limit) {
        return undefined;
      }
      return lastPageParam + 1;
    },
    getPreviousPageParam: (_, __, firstPageParam) => {
      if (firstPageParam === 0) {
        return undefined;
      }
      return firstPageParam - 1;
    },
  });

  const loadNext = useCallback(() => {
    hasNextPage && fetchNextPage();
  }, [fetchNextPage, hasNextPage]);

  const onRefresh = useCallback(() => {
    if (!isRefreshing) {
      setIsRefreshing(true);
      refetch()
        .then(() => setIsRefreshing(false))
        .catch(() => setIsRefreshing(false));
    }
  }, [isRefreshing, refetch]);

  const flattenData = useMemo(() => {
    return data?.pages.flatMap((page) => page.events) || [];
  }, [data?.pages]);

  return {
    data: flattenData,
    onEndReached: loadNext,
    isRefreshing,
    onRefresh,
    isFetchingNextPage,
    isLoading,
  };
};
