import { useDebounce } from '@/shared/hooks';
import type { Symptom } from '@/shared/interface';
import type { ApiPaginationResponseType } from '@/shared/services/http';
import { httpService, responseWrapper } from '@/shared/services/http';
/* eslint-disable @typescript-eslint/naming-convention */
import { useInfiniteQuery } from '@tanstack/react-query';
import { isEmpty } from 'lodash-es';
import { useMemo, useState } from 'react';

interface PageParameter {
  offset: number;

  limit: number;
  name?: string;
  total?: number;
  number?: number;
  size?: number;
}

const LIMIT = 8;

const fetchSymptoms = async ({
  name,
  limit,
  offset
}: {
  limit?: number;
  name?: string;
  offset?: number;
}): Promise<ApiPaginationResponseType<Symptom[]>> => {
  const response = await httpService.getMany<Symptom[]>(
    `/references/symptoms?name=${name}&limit=${limit}&offset=${offset}`
  );
  return response;
};

export const useGetLazyListSymptoms = () => {
  const [inputSearch, setInputSearch] = useState<string>('');
  const { debouncedValue: keywords } = useDebounce(inputSearch);

  const {
    data,
    error,
    isFetching,
    isRefetching,
    isFetchingNextPage,
    fetchNextPage
  } = useInfiniteQuery({
    queryKey: [`symptoms`, `${keywords}`, `${LIMIT}`],
    async queryFn({ pageParam }: { pageParam: PageParameter }) {
      const response = (await responseWrapper(fetchSymptoms, [
        {
          limit: LIMIT,
          name: keywords,
          offset: pageParam.offset
        }
      ])) as ApiPaginationResponseType<Symptom[]>;
      return response;
    },

    getNextPageParam(lastPage) {
      const { total, number, size } = lastPage.data.page;
      if (number * size >= total) return undefined;
      return {
        name: inputSearch,
        limit: LIMIT,
        offset: number * size
      };
    },
    initialPageParam: { name: inputSearch, limit: LIMIT, offset: 0 }
  });

  const symptoms = useMemo(() => {
    if (isEmpty(data?.pages)) return [];
    return (
      data?.pages?.reduce<Symptom[]>((state, page) => {
        const symptomsList = page?.data?.data || [];
        return [...state, ...symptomsList];
      }, []) ?? []
    );
  }, [data]);

  return {
    symptoms,
    error,
    isFetching,
    isRefetching,
    isFetchingNextPage,
    fetchNextPage,
    inputSearch,
    setInputSearch
  };
};
