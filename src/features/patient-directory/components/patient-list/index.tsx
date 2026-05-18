import FilterPatientListPopup from '@/features/patient-directory/components/filter-patient-list-popup';
import { usePatientDirectoryColumns } from '@/features/patient-directory/hooks/views/usePatientDirectoryColumns';
import type {
  PatientDirectoryRequest,
  PatientDirectoryResponse
} from '@/features/patient-directory/interface';
import { DataTable } from '@/shared/components/blocks/DataTable';
import { DataTableFilterCmp } from '@/shared/components/blocks/DataTable/DataTableFilterCmp';
import type { TableParams } from '@/shared/components/blocks/DataTable/helpers';
import { Button } from '@/shared/components/ui/Button';
import type { AgeRange } from '@/shared/interface';
import type { ApiPaginationData } from '@/shared/services/http/helpers';
import { isEmpty } from 'lodash-es';
import { useEffect, useState } from 'react';

export interface ParamsProps extends Record<string, unknown> {
  country: string[];
  sex: string[];
  ageRange: AgeRange[];
}

interface Props {
  patientDirectory: ApiPaginationData<PatientDirectoryResponse[]>;
  selectedDiseases: string[];
  onGetPatientDirectory: (params: PatientDirectoryRequest) => void;
}

export default function PatientList({
  patientDirectory,
  selectedDiseases,
  onGetPatientDirectory
}: Props) {
  const { data, page } = patientDirectory;

  const { columns } = usePatientDirectoryColumns({
    selectedDiseases
  });

  const [viewData, setViewData] = useState(data || []);

  const [isShowFilterPopup, setIsShowFilterPopup] = useState(false);

  const [additionalFilterParams, setAdditionalFilterParams] =
    useState<ParamsProps>({} as ParamsProps);

  const handleGetData = (params?: TableParams) => {
    onGetPatientDirectory({ ...params, diseaseCodes: selectedDiseases });
  };

  useEffect(() => {
    setViewData(data);
  }, [data]);

  if (!page) return null;
  return (
    <div className="h-full w-full rounded-2xl bg-background-default">
      <div className="flex flex-col gap-1">
        <div className="flex w-full flex-row justify-between gap-2 px-6 py-4">
          <span className="text-lg font-bold text-text-default">
            Results ({page?.total})
          </span>
          <DataTableFilterCmp
            isFiltering={
              !isEmpty(additionalFilterParams.ageRange) ||
              !isEmpty(additionalFilterParams.country) ||
              !isEmpty(additionalFilterParams.sex)
            }
            maintContent={
              <FilterPatientListPopup
                initParams={additionalFilterParams}
                onSetIsShowFilterPopup={setIsShowFilterPopup}
                onSetParams={setAdditionalFilterParams}
              />
            }
            isOpen={isShowFilterPopup}
            setIsOpen={setIsShowFilterPopup}
          />
        </div>
        <div className="flex flex-col gap-4 border-t px-6">
          <DataTable
            initialState={{
              pagination: { pageIndex: 0, pageSize: 10 }
            }}
            additionalFilterParams={additionalFilterParams}
            columns={columns}
            data={viewData}
            onAction={handleGetData}
          />
        </div>
        {page?.total > 10 && (
          <div className="flex cursor-pointer justify-center font-semibold">
            {viewData.length < 3 ? (
              <Button
                className="text-md text-link-default"
                onClick={() => setViewData(data)}
                size="lg"
                variant="ghost"
              >
                View more
              </Button>
            ) : (
              <Button
                className="text-md text-link-default"
                onClick={() => setViewData((prev) => prev?.slice(0, 2))}
                size="lg"
                variant="ghost"
              >
                View less
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
