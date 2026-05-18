/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
import { ErrorIcon } from '@/assets/icons/error-icon';
import { GeneFileUploadIcon } from '@/assets/icons/gene-file-upload-icon';
import { GenreIcon } from '@/assets/icons/genre-icon';
import { HealthRecordIcon } from '@/assets/icons/health-record-icon';
import { convertSymptomOptions } from '@/features/health-record/components/health-record-detail/analysing-form/helpers';
import SymptomDescription from '@/features/health-record/components/health-record-detail/analysing-form/symptom-description';
import useCreateAnalysis from '@/features/health-record/hooks/api/useCreateAnalysis';
import { useGetLazyListSymptoms } from '@/features/health-record/hooks/api/useGetListSymptoms';
import type { HealthRecordAnalysisMetadata } from '@/features/health-record/interface';
import FileUpload from '@/shared/components/blocks/FileUpload';
import { FormField } from '@/shared/components/blocks/FormField';
import { MultiPicklist } from '@/shared/components/blocks/MultiPicklist';
import type { PicklistOption } from '@/shared/components/blocks/Picklist';
import { Button } from '@/shared/components/ui/Button';
import ToolTip from '@/shared/components/ui/ToolTip';
import { useModalProvider, useToastProvider } from '@/shared/hooks';
import { useMultiPicklist } from '@/shared/hooks/useMultiPicklist';
import { usePromptNavigate } from '@/shared/hooks/usePromptNavigate';
import { type FileProps, UploadStatus } from '@/shared/interface';
import { encryptKeyBySignature, fromBase64 } from '@/shared/libs/utils';
import { useAuthStore } from '@/shared/stores/useAuthStore';
import { useEffect, useMemo, useState } from 'react';

interface Props {
  id: string;
  onGetAnalysis: () => void;
  initData?: HealthRecordAnalysisMetadata;
}

export default function AnalysingForm({ id, initData, onGetAnalysis }: Props) {
  const { showToast } = useToastProvider();
  const { onCloseModal } = useModalProvider();

  const { authStore } = useAuthStore();

  const [isDisabledAnalysis, setIsDisabledAnalysis] = useState(false);

  const [ehrFiles, setEHRFiles] = useState<FileProps[]>(
    initData?.ehrFileKey
      ? [
          {
            fileKey: initData.ehrFileKey.fileKey,
            fileName: initData.ehrFileKey.fileName,
            fileType: initData.ehrFileKey.fileType,
            checksum: initData.ehrFileKey.checksum,
            status: UploadStatus.Success
          }
        ]
      : []
  );
  const [geneFiles, setGeneFiles] = useState<FileProps[]>(
    initData?.geneFileKey
      ? [
          {
            fileKey: initData.geneFileKey.fileKey,
            fileName: initData.geneFileKey.fileName,
            fileType: initData.geneFileKey.fileType,
            checksum: initData.geneFileKey.checksum,
            status: UploadStatus.Success
          }
        ]
      : []
  );

  const {
    symptoms,
    setInputSearch,
    isFetchingNextPage,
    isFetching: isSearching,
    fetchNextPage
  } = useGetLazyListSymptoms();

  const initAllSymptoms = useMemo(() => {
    if (!initData?.symptoms) return symptoms;
    return [...initData.symptoms, ...symptoms];
  }, [initData?.symptoms, symptoms]);

  const {
    selectedData: selectedSymptoms,
    combineInitOptions,
    setSelectedData: setSelectedSymptoms
  } = useMultiPicklist({
    data: initAllSymptoms,
    convertDataToOptions: convertSymptomOptions
  });

  useEffect(() => {
    if (!initData?.symptoms || initData?.symptoms.length === 0) return;
    setSelectedSymptoms(
      initData?.symptoms?.map((symptom) => symptom?.metadata.hpoId) || []
    );
  }, []);

  usePromptNavigate(true, 'Changes you made may not be saved. Leave anyway?');

  const { onCreateAnalysis, isPending: isCreating } = useCreateAnalysis(
    { id },
    {
      onSuccess: () => {
        localStorage.removeItem('plainTextDEK');
        localStorage.removeItem('iv2Base64');
        setTimeout(() => {
          onCloseModal(); // in case re-analyse
          onGetAnalysis();
        }, 1000);
      },
      onError: () => {
        showToast({
          title: 'Identifing unsuccessfully',
          variant: 'error'
        });
        setIsDisabledAnalysis(false);
      }
    }
  );

  const handleSelectSymptoms = (value: string[]) => {
    setSelectedSymptoms(value);
  };

  const handleClickAnalyze = async () => {
    setIsDisabledAnalysis(true);
    const plainTextDEK = localStorage.getItem('plainTextDEK');

    let encryptedDEK;

    if (!plainTextDEK || !authStore.user?.signature) {
      encryptedDEK = geneFiles[0]?.encryptedDEK;
    } else {
      encryptedDEK = await encryptKeyBySignature({
        key: fromBase64(plainTextDEK),
        signature: authStore.user?.signature
      });
    }

    onCreateAnalysis({
      hpoIDs: selectedSymptoms,
      geneFile: {
        fileKey: geneFiles[0]?.fileKey,
        checksum: geneFiles[0]?.checksum,
        fileType: geneFiles[0]?.fileType,
        fileName: geneFiles[0]?.fileName || geneFiles[0]?.fileKey
      },
      ehrFile:
        ehrFiles.length > 0
          ? {
              fileKey: ehrFiles[0]?.fileKey,
              checksum: ehrFiles[0]?.checksum,
              fileType: ehrFiles[0]?.fileType,
              fileName: ehrFiles[0]?.fileName || ehrFiles[0]?.fileKey
            }
          : undefined,
      encryptedDEK
    });
  };

  return (
    <div className="flex-1 rounded-lg bg-background-default shadow-sm">
      <div className="absolute top-[-30px] flex w-full flex-row gap-2 rounded-t-lg bg-background-brand-primary-subtle px-6 py-2">
        <ErrorIcon color="#726B66" />
        <span className="text-sm font-normal text-text-description">
          Genorare doesn't provide medical advice or diagnosis.
        </span>
      </div>
      <div className="h-fit">
        <div className="border-b">
          <div className="flex flex-row items-center gap-3 p-6">
            <GenreIcon />
            <div className="flex flex-col gap-1">
              <span className="text-xl font-semibold text-text-default">
                Genorare analysis
              </span>
              <span className="text-sm font-normal text-text-description">
                AI-identification based on symptoms and genome file
              </span>
            </div>
          </div>
        </div>
        <div className="flex h-[calc(50vh)] w-full flex-col gap-6 overflow-auto p-6">
          <FormField id="symptoms" label="Symptoms" required>
            <MultiPicklist
              renderOption={(option: PicklistOption) => (
                <div className="group flex w-full flex-row items-center justify-between rounded-md p-2 hover:bg-background-default-hover">
                  <div className="flex flex-col gap-1">
                    <div className="text-md font-normal text-text-default">
                      {option.label}
                    </div>
                    {option.synonyms ? (
                      <div className="text-sm font-normal text-text-description">
                        {option.synonyms}
                      </div>
                    ) : null}
                  </div>
                  <ToolTip content={<SymptomDescription data={option} />} />
                </div>
              )}
              allowLazyLoad={true}
              className="w-full"
              fetchNextPage={fetchNextPage}
              isSearching={isSearching}
              loading={isFetchingNextPage}
              onChange={handleSelectSymptoms}
              onSetInputSearch={setInputSearch}
              options={combineInitOptions}
              placeholder="Type symptoms. Ex: Hypoplasia of the ulna, Short finger, Cleft upper lip, Cleft eyelid"
              value={selectedSymptoms}
            />
          </FormField>
          <FormField id="file" label="Upload genome file" required>
            <FileUpload
              acceptFormats=".vcf"
              destination="trust-partner"
              fieldName="geneFile"
              initFiles={geneFiles}
              label="Genome file (.vcf only)"
              maxCountFiles={1}
              maxSizeMB={500}
              resultIcon={<GeneFileUploadIcon />}
              setInitFiles={setGeneFiles}
              variant="drag-drop"
              isNeedEncrypt
            />
          </FormField>
          <FormField
            id="file-ehr"
            label="Upload electric health record - EHR file (coming soon)"
          >
            <FileUpload
              acceptFormats=".pdf"
              initFiles={ehrFiles}
              isDisabled={true} //coming soon
              label="EHR file (.pdf only)"
              resultIcon={<HealthRecordIcon isFilled={true} />}
              setInitFiles={setEHRFiles}
              variant="drag-drop"
            />
          </FormField>
        </div>
      </div>

      <div className="flex w-full items-center justify-center border-t p-3">
        <Button
          isDisabled={
            !selectedSymptoms ||
            selectedSymptoms.length === 0 ||
            (ehrFiles.length > 0 &&
              ehrFiles[0]?.status !== UploadStatus.Success) ||
            geneFiles.length === 0 ||
            geneFiles[0]?.status !== UploadStatus.Success ||
            isCreating ||
            isDisabledAnalysis
          }
          onClick={handleClickAnalyze}
          size={'lg'}
          variant={'primary'}
        >
          {isDisabledAnalysis ? 'Analysing...' : 'Analyse'}
        </Button>
      </div>
    </div>
  );
}
