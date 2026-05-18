import type { ApiResponseType } from '@/shared/services/http';
import { httpSupabaseService, responseWrapper } from '@/shared/services/http';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export interface TemplateOption {
  key: string; // uuid
  label: string;
  status: null | string;
  previewUrl: null | string;
  templateId: string; // number
  templateTag: null | string;
  price: null | string;
  listParams: unknown[];
}

const fetchZnsTemplates = () =>
  httpSupabaseService.get<TemplateOption[]>('/getZnsTemplates');

export const useGetZnsTemplates = () => {
  const queryClient = useQueryClient();

  const { data: payload, isFetching } = useQuery({
    queryKey: ['getZnsTemplates'],
    queryFn: async () =>
      (await responseWrapper<TemplateOption[], []>(
        fetchZnsTemplates,
        []
      )) as ApiResponseType<TemplateOption[]>
  });

  const handleInvalidateTemplates = async () => {
    await queryClient.invalidateQueries({ queryKey: ['getZnsTemplates'] });
  };

  return {
    templates: payload?.data ?? [],
    isFetching,
    handleInvalidateTemplates
  };
};
