import type {
  PatientDirectoryRequest,
  PatientDirectoryResponse
} from '@/features/patient-directory/interface';
import type { ApiPaginationResponseType } from '@/shared/services/http';
import { httpService, responseWrapper } from '@/shared/services/http';
import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

const mutateFetchPatientDirectory = (payload: PatientDirectoryRequest) =>
  httpService.post<PatientDirectoryResponse[], PatientDirectoryRequest>(
    `/experts/patient-directory`,
    payload
  );

export const useGetListPatientDirectory = (
  options?: UseMutationOptions<
    ApiPaginationResponseType<PatientDirectoryResponse[]>,
    Error,
    PatientDirectoryRequest
  >
) => {
  const {
    mutate: onGetPatientDirectory,
    isSuccess,
    isPending,
    isError
  } = useMutation<
    ApiPaginationResponseType<PatientDirectoryResponse[]>,
    Error,
    PatientDirectoryRequest
  >({
    mutationFn: async (payload: PatientDirectoryRequest) =>
      (await responseWrapper(mutateFetchPatientDirectory, [
        payload
      ])) as ApiPaginationResponseType<PatientDirectoryResponse[]>,
    ...options
  });

  return {
    onGetPatientDirectory,
    isSuccess,
    isPending,
    isError
  };
};
