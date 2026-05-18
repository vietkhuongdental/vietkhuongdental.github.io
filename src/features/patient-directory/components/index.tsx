// import { convertDiseaseToOptions } from '@/features/expert-onboarding/components/professional-information-onboarding/helpers';
// import { useGetLazyListDiseases } from '@/features/expert-onboarding/hooks/useGetListDiseases';
// import DiseaseDescription from '@/features/patient-directory/components/disease-description';
import EmptyPatient from '@/features/patient-directory/components/empty-patient';
import PatientList from '@/features/patient-directory/components/patient-list';
import { useGetListPatientDirectory } from '@/features/patient-directory/hooks/api/useGetPatientDirectory';
import type { PatientDirectoryResponse } from '@/features/patient-directory/interface';
// import { MultiPicklist } from '@/shared/components/blocks/MultiPicklist';
// import type { PicklistOption } from '@/shared/components/blocks/Picklist';
import { Button } from '@/shared/components/ui/Button';
// import ToolTip from '@/shared/components/ui/ToolTip';
import { useMultiPicklist } from '@/shared/hooks/useMultiPicklist';
import type { ApiPaginationData } from '@/shared/services/http/helpers';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function PatientDirectory() {
  const [searchParams] = useSearchParams();

  const [patientDirectory, setPatientDirectory] =
    useState<ApiPaginationData<PatientDirectoryResponse[]>>();

  const { onGetPatientDirectory } = useGetListPatientDirectory({
    onSuccess: (response) => {
      setPatientDirectory(response.data);
    }
  });

  // const {
  //   diseases,
  //   setInputSearch,
  //   isFetchingNextPage,
  //   isFetching: isSearching,
  //   fetchNextPage
  // } = useGetLazyListDiseases();

  // // 1
  // const initDiseases = useMemo(
  //   () =>
  //     !searchParams.getAll('disease').length
  //       ? diseases
  //       : [
  //           ...diseases,
  //           ...searchParams.getAll('disease').map((disease) => ({
  //             metadata: {
  //               orphaCode: JSON.parse(disease).orphaCode
  //             },
  //             name: JSON.parse(disease).name
  //           }))
  //         ],
  //   [diseases]
  // );

  const {
    selectedData: selectedDiseases,
    setSelectedData: setSelectedDiseases
  } = useMultiPicklist({
    data: [], // diseases,
    convertDataToOptions: () => [] // convertDiseaseToOptions(diseases),
  });

  // 2
  useEffect(() => {
    setSelectedDiseases(
      searchParams
        .getAll('disease')
        ?.map((disease) => JSON.parse(disease).orphaCode)
    );
  }, []);

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-col gap-3 rounded-t-2xl bg-background-brand-primary-subtle px-8 py-6">
        <h6>Find suitable patients</h6>
        <div className="flex flex-row gap-4">
          {/* <MultiPicklist
            // renderOption={(option: PicklistOption) => (
            //   <div className="group flex w-full flex-row items-center justify-between rounded-md p-2 hover:bg-background-default-hover">
            //     <div className="flex flex-col gap-1">
            //       <div className="text-md font-normal text-text-default">
            //         {option.label}
            //       </div>
            //       {option.synonyms ? (
            //         <div className="text-sm font-normal text-text-description">
            //           {option.synonyms}
            //         </div>
            //       ) : null}
            //     </div>
            //   </div>
            // )}
            renderOption={(option: PicklistOption) => (
              <div className="group flex w-full flex-row items-center justify-between rounded-md p-2 hover:bg-background-default-hover">
                <div className="flex flex-col gap-1">
                  <div className="text-md font-normal text-text-default">
                    {option.label}
                  </div>
                </div>
                <ToolTip content={<DiseaseDescription data={option} />} />
              </div>
            )}
            allowLazyLoad={true}
            className="w-full rounded-md"
            fetchNextPage={fetchNextPage}
            isSearching={isSearching}
            loading={isFetchingNextPage}
            onChange={setSelectedDiseases}
            onSetInputSearch={setInputSearch}
            options={combineInitOptions}
            placeholder="Search rare diseases"
            value={selectedDiseases}
          /> */}
          <Button size="lg">Search</Button>
        </div>
      </div>
      <div className="flex h-full flex-col items-center justify-start rounded-b-2xl bg-background-default">
        {selectedDiseases.length > 0 && patientDirectory ? (
          <PatientList
            onGetPatientDirectory={onGetPatientDirectory}
            patientDirectory={patientDirectory}
            selectedDiseases={selectedDiseases}
          />
        ) : (
          <EmptyPatient />
        )}
      </div>
    </div>
  );
}
