import { AgeIcon } from '@/assets/icons/age-icon';
import { GenderIcon } from '@/assets/icons/gender-icon';
import { LocationIcon } from '@/assets/icons/location-icon';
// import ConnectionButton from '@/features/connection/common/components/connection-button';
// import { useGetConnectionWithPatients } from '@/features/connection/common/hooks/useGetConnectionWithPatients';
// import DiseaseResultList from '@/features/health-record/components/health-record-anonymized-view/disease-result-list';
import useGetAnonymizedHealthRecordById from '@/features/health-record/hooks/api/useGetAnonymizedHealthRecordById';
import DescriptionItem from '@/shared/components/blocks/DescriptionItem';
// import { useEffect } from 'react';

interface Props {
  id: string;
}

export default function HealthRecordAnonymizedView({ id }: Props) {
  const { data: recordData } = useGetAnonymizedHealthRecordById({
    id
  });

  // const {
  //   data: connection,
  //   setParams,
  //   isFetching,
  //   handleInvalidateConnections
  // } = useGetConnectionWithPatients();

  // useEffect(() => {
  //   setParams({ patientId: recordData?.accountId || '' });
  // }, [recordData?.accountId]);

  if (!recordData) return null;

  return (
    <div className="p-2">
      <div className="mb-6 flex flex-col items-center justify-between md:flex-row">
        <h5 className="flex flex-row gap-2">
          <div className="flex flex-col">
            {recordData?.anonymizedName}
            <p className="flex h-fit flex-row items-center gap-1 text-sm font-normal text-text-subtle">
              Created by{' '}
              <img
                alt="User Avatar"
                className="h-8 w-8 rounded-full"
                src="/anonymous-avatar.png"
              />
              <strong className="font-semibold text-text-default">
                {recordData?.createdBy}
              </strong>
              . You can view more and send message to connected users
            </p>
          </div>
        </h5>
        {/* {!isFetching && (
          <div className="flex flex-row items-center gap-2">
            <ConnectionButton
              isReceived={connection[0]?.isReceived}
              onRefresh={handleInvalidateConnections}
              otherId={recordData?.accountId}
              status={connection[0]?.status}
            />
          </div>
        )} */}
      </div>
      <div className="w-full">
        <div className="flex flex-col gap-6 md:flex-row">
          {/* Main content */}
          {/* <DiseaseResultList
            analysisData={recordData}
            connectionStatus={connection[0]?.status}
          /> */}

          {/* Right bar */}
          <div className="flex w-full flex-col gap-6 md:w-80">
            {/* Basic Infomation */}
            <div className="rounded-lg bg-background-default shadow-sm">
              <div className="border-b">
                <h2 className="px-6 py-4 text-lg font-bold">
                  Basic Infomation
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-6 p-6">
                <DescriptionItem
                  description={`${recordData?.metadata.ageRange.minAge} - ${recordData?.metadata.ageRange.maxAge}`}
                  icon={<AgeIcon />}
                  title="Age"
                />
                <DescriptionItem
                  description={recordData?.metadata.sex}
                  icon={<GenderIcon />}
                  title="Sex"
                />
                <DescriptionItem
                  description={recordData?.metadata.country}
                  icon={<LocationIcon />}
                  title="Country"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
