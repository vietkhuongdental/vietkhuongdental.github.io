import type { UserResponse } from '@/features/user-management/interface';
import type { TableParams } from '@/shared/components/blocks/DataTable/helpers';
import { useDebounce } from '@/shared/hooks';
import { stringify } from '@/shared/libs/utils';
import type { ApiPaginationResponseType } from '@/shared/services/http';
import { httpSupabaseService, responseWrapper } from '@/shared/services/http';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { isEmpty } from 'lodash-es';
import { useState } from 'react';

const fetchUsers = (params: TableParams) =>
  httpSupabaseService.getMany<UserResponse[]>(
    `/getCustomers?${stringify(params)}`
  );

export const useGetListUsers = () => {
  const [inputSearch, setInputSearch] = useState<string>('');
  const { debouncedValue: searchKeywords } = useDebounce(inputSearch);

  const [params, setParams] = useState<TableParams>({});

  const { data, error, isFetching, isRefetching } = useQuery({
    queryKey: [`getCustomers`, params, searchKeywords],
    enabled: !isEmpty(params),
    queryFn: async () =>
      (await responseWrapper<UserResponse[], [typeof params]>(fetchUsers, [
        { ...params, search: searchKeywords }
      ])) as ApiPaginationResponseType<UserResponse[]>
  });

  const queryClient = useQueryClient();

  const handleInvalidateUsers = async () => {
    await queryClient.invalidateQueries({
      queryKey: ['getCustomers', params]
    });
  };

  return {
    data: data?.data,
    error,
    isFetching,
    isRefetching,
    inputSearch,
    setInputSearch,
    setParams,
    handleInvalidateUsers
  };
};
