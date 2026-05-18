import { AgeIcon } from '@/assets/icons/age-icon';
import { DotIcon } from '@/assets/icons/dot-icon';
import { GenderIcon } from '@/assets/icons/gender-icon';
import GlobalIcon from '@/assets/icons/global-icon';
import { HealthRecordDetailIcon } from '@/assets/icons/health-record-detail-icon';
import { LocationIcon } from '@/assets/icons/location-icon';
import CreateEditHealthRecord from '@/features/health-record/components/create-edit-health-record';
import DeleteHealthRecordModal from '@/features/health-record/components/health-record-list/delete-heath-record-modal';
import {
  AnalysisStep,
  convertDobToAge,
  getAnalysisStatusColor
} from '@/features/health-record/helpers';
import type { HealthRecord } from '@/features/health-record/interface';
import { ActionSelectOption } from '@/shared/components/blocks/ActionSelectOption';
import DescriptionItem from '@/shared/components/blocks/DescriptionItem';
import { Tag } from '@/shared/components/ui/Tag';
import { useModalProvider } from '@/shared/hooks';
import { cn } from '@/shared/libs/utils';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  record: HealthRecord;
}

export default function HealthRecordCard({ record }: Props) {
  const navigate = useNavigate();
  const { onShowModal } = useModalProvider();

  const handleClickCard = useCallback(() => {
    if (!record?.id) return;
    navigate('/health-record/:id'.replace(':id', record.id.toString()));
  }, []);

  const handleClickDeleteHealthRecord = useCallback(
    (id: string) => {
      if (!id) return;
      onShowModal({
        title: `Delete "${record.title}"`,
        hideButton: true,
        children: (
          <DeleteHealthRecordModal
            id={id}
            name={record.title || 'this health record'}
          />
        )
      });
    },
    [record]
  );

  const handleClickEditHealthRecord = useCallback(
    (id: string) => {
      if (!id) return;
      onShowModal({
        title: `Edit health record`,
        hideButton: true,
        children: <CreateEditHealthRecord initData={record} isEdit={true} />
      });
    },
    [record]
  );

  return (
    <label
      className={cn(
        'rounded-xl border shadow hover:border-border-brand-primary-hover',
        'flex flex-col justify-between px-5 py-6 md:flex-row',
        'relative bg-background-default transition-colors'
      )}
      htmlFor="patient"
      onClick={handleClickCard}
    >
      <div className="flex cursor-pointer flex-row items-start gap-4">
        <HealthRecordDetailIcon className="w-10" isFilled={true} />
        <div className="flex flex-col gap-2">
          <span className="text-xl font-semibold">{record.title}</span>

          <div className="flex flex-col gap-5 md:flex-row md:gap-20">
            <DescriptionItem
              description={convertDobToAge(record.dayOfBirth).toString()}
              icon={<AgeIcon />}
              title="Age"
            />
            <DescriptionItem
              description={record.sex}
              icon={<GenderIcon />}
              title="Sex"
            />
            <DescriptionItem
              description={record.country}
              icon={<LocationIcon />}
              title="Country"
            />
          </div>
        </div>
      </div>
      <div className="mr-8 flex flex-col gap-2 lg:flex-row">
        {record?.isPublish ? (
          <Tag
            color="gray"
            icon={<GlobalIcon color="#726B66" />}
            label="Opened for matching"
            size="md"
            variant="filled"
          />
        ) : null}
        {record?.analysisStep === AnalysisStep.NotStarted ||
        record?.analysisStep === AnalysisStep.ResultReady ? (
          <Tag
            label={
              record?.analysisStep === AnalysisStep.ResultReady
                ? 'Complete'
                : 'Empty'
            }
            color={getAnalysisStatusColor(record.analysisStep)}
            size="md"
            variant="filled"
          />
        ) : null}
      </div>
      <div className="absolute right-5 top-5">
        <ActionSelectOption
          itemList={[
            {
              label: 'Edit basic information',
              onClick: (e: React.MouseEvent<HTMLDivElement>) => {
                e.stopPropagation();
                if (!record.id) return;
                handleClickEditHealthRecord(record.id);
              }
            },
            {
              label: 'Delete health record',
              onClick: (e: React.MouseEvent<HTMLDivElement>) => {
                e.stopPropagation();
                if (!record.id) return;
                handleClickDeleteHealthRecord(record.id);
              }
            }
          ]}
          iconTrigger={<DotIcon />}
        />
      </div>
    </label>
  );
}
