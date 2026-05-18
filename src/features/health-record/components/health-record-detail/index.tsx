import { ActionIcon } from '@/assets/icons/action-icon';
import { AgeIcon } from '@/assets/icons/age-icon';
import { DiseaseIcon } from '@/assets/icons/disease-icon';
import { GenderIcon } from '@/assets/icons/gender-icon';
import GlobalIcon from '@/assets/icons/global-icon';
import { LocationIcon } from '@/assets/icons/location-icon';
import CreateEditHealthRecord from '@/features/health-record/components/create-edit-health-record';
import AnalysingForm from '@/features/health-record/components/health-record-detail/analysing-form';
import AnalysingProcess from '@/features/health-record/components/health-record-detail/analysing-process';
import DiseaseResultList from '@/features/health-record/components/health-record-detail/disease-result-list';
import CloseMatchingModal from '@/features/health-record/components/health-record-detail/disease-result-list/close-matching-modal';
import OpenMatchingModal from '@/features/health-record/components/health-record-detail/disease-result-list/open-matching-modal';
import DeleteHealthRecordModal from '@/features/health-record/components/health-record-list/delete-heath-record-modal';
import {
  AnalysisStatus,
  AnalysisStep,
  convertDobToAge
} from '@/features/health-record/helpers';
import useGetAnalysis from '@/features/health-record/hooks/api/useGetAnalysis';
import useGetHealthRecordById from '@/features/health-record/hooks/api/useGetHealthRecordById';
import usePatchHealthRecordStatus from '@/features/health-record/hooks/api/usePatchHealthRecordStatus';
import { ActionSelectOption } from '@/shared/components/blocks/ActionSelectOption';
import DescriptionItem from '@/shared/components/blocks/DescriptionItem';
import { Button } from '@/shared/components/ui/Button';
import { useModalProvider } from '@/shared/hooks';
import { useCallback, useEffect, useMemo, useState } from 'react';

interface Props {
  id: string;
}

export default function HealthRecordDetail({ id }: Props) {
  const { onShowModal, onCloseAllModals } = useModalProvider();
  const { data: analysisData, onGetAnalysis } = useGetAnalysis({
    id
  });

  const { data: recordData, onGetHealthRecordById } = useGetHealthRecordById({
    id
  });

  const { onUpdateHealthRecordStatus, isPending } = usePatchHealthRecordStatus(
    { id },
    {
      onSuccess: async () => {
        onGetHealthRecordById();
        onCloseAllModals();
      }
    }
  );

  const [step, setStep] = useState<AnalysisStep>(
    analysisData?.analysisStep || AnalysisStep.NotStarted
  );

  const [status, setStatus] = useState<AnalysisStatus>(
    !analysisData?.analysisStatus ||
      analysisData?.analysisStatus === AnalysisStatus.Pending
      ? AnalysisStatus.Processing
      : analysisData?.analysisStatus
  );

  useEffect(() => {
    setStatus(
      !analysisData?.analysisStatus ||
        analysisData?.analysisStatus === AnalysisStatus.Pending
        ? AnalysisStatus.Processing
        : analysisData?.analysisStatus
    );
    setStep(analysisData?.analysisStep || AnalysisStep.NotStarted);
  }, [analysisData]);

  const handleClickDeleteHealthRecord = useCallback(
    (id: string) => {
      if (!id) return;
      onShowModal({
        title: `Delete "${recordData?.title}"`,
        hideButton: true,
        children: (
          <DeleteHealthRecordModal
            id={id}
            name={recordData?.title || 'this health record'}
          />
        )
      });
    },
    [recordData?.title]
  );

  const handleClickEditHealthRecord = useCallback(
    (id: string) => {
      if (!id) return;
      onShowModal({
        title: `Edit health record`,
        hideButton: true,
        children: <CreateEditHealthRecord initData={recordData} isEdit={true} />
      });
    },
    [recordData]
  );

  const handleClickOpenCloseMatching = (target: boolean) => {
    onShowModal({
      title: !target
        ? 'Close for matching with experts'
        : 'Open for matching with experts',
      children: !target ? (
        <CloseMatchingModal
          onClickCancel={async () => {
            onCloseAllModals();
          }}
          onClickConfirm={async () => {
            onUpdateHealthRecordStatus({ isPublish: false });
          }}
        />
      ) : (
        <OpenMatchingModal
          onClickConfirm={async () => {
            onUpdateHealthRecordStatus({ isPublish: true });
          }}
        />
      ),
      hideButton: true
    });
  };

  const handleBackToAnalysingForm = () => {
    setStep(AnalysisStep.NotStarted);
  };

  const mainContent = useMemo(() => {
    switch (step) {
      case AnalysisStep.NotStarted:
        return (
          <AnalysingForm
            initData={
              analysisData?.analysisStep !== AnalysisStep.NotStarted // support on Clicking Back
                ? analysisData?.metadata
                : undefined
            }
            id={id}
            onGetAnalysis={onGetAnalysis}
          />
        );
      case AnalysisStep.ResultReady:
        return <DiseaseResultList analysisData={analysisData} />;
    }

    return (
      <AnalysingProcess
        id={id}
        onBackToAnalysingForm={handleBackToAnalysingForm}
        onGetAnalysis={onGetAnalysis}
        onSetStatus={setStatus}
        status={status}
        step={step}
      />
    );
  }, [step, status, analysisData]);

  if (!recordData) return null;

  return (
    <div className="p-2">
      <div className="mb-6 flex flex-col items-center justify-between md:flex-row">
        <h5 className="flex flex-row gap-2">
          <div className="flex flex-col">{recordData?.title}</div>
        </h5>
        <div className="flex flex-col items-center gap-2 md:flex-row">
          {!recordData.isPublish ? (
            <Button
              leadingIcon={
                <GlobalIcon
                  color={
                    isPending || step !== AnalysisStep.ResultReady
                      ? '#95908c'
                      : undefined
                  }
                />
              }
              isDisabled={isPending || step !== AnalysisStep.ResultReady}
              onClick={() => handleClickOpenCloseMatching(true)}
              size="md"
              variant="primary"
            >
              Open for matching
            </Button>
          ) : (
            <Button
              className="border-1 border border-black"
              isDisabled={isPending}
              onClick={() => handleClickOpenCloseMatching(false)}
              size="md"
              variant="ghost"
            >
              <span className="text-md font-semibold">Close for matching</span>
            </Button>
          )}

          <ActionSelectOption
            itemList={[
              {
                label: 'Edit basic information',
                onClick: (e: React.MouseEvent<HTMLDivElement>) => {
                  e.stopPropagation();
                  if (!recordData?.id) return;
                  handleClickEditHealthRecord(recordData.id);
                }
              },
              {
                label: 'Delete health record',
                onClick: (e: React.MouseEvent<HTMLDivElement>) => {
                  e.stopPropagation();
                  if (!recordData?.id) return;
                  handleClickDeleteHealthRecord(recordData.id);
                }
              }
            ]}
            iconTrigger={<ActionIcon />}
          />
        </div>
      </div>
      <div className="h-full w-full">
        <div className="flex flex-col gap-6 md:flex-row">
          {/* Main content */}
          {mainContent}

          {/* Right bar */}
          <div className="flex w-full flex-col gap-6 md:w-80">
            {/* Basic Infomation */}
            <div className="flex flex-col gap-4 rounded-lg bg-background-default shadow-sm">
              <div className="border-b">
                <h2 className="px-6 py-4 text-lg font-bold">
                  Basic Infomation
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-6 px-6">
                <DescriptionItem
                  description={convertDobToAge(
                    recordData?.dayOfBirth || new Date()
                  ).toString()}
                  icon={<AgeIcon />}
                  title="Age"
                />
                <DescriptionItem
                  description={recordData?.sex}
                  icon={<GenderIcon />}
                  title="Sex"
                />
              </div>
              <div className="grid grid-cols-1 gap-6 px-6 pb-4">
                <DescriptionItem
                  description={recordData?.country}
                  icon={<LocationIcon />}
                  title="Country"
                />
                {recordData?.metadata?.diagnosedDisease ? (
                  <DescriptionItem
                    description={recordData.metadata.diagnosedDisease}
                    icon={<DiseaseIcon />}
                    title="Previously diagnosed disease"
                  />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
