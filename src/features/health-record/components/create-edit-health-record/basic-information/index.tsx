import { AgeIcon } from '@/assets/icons/age-icon';
import { DiseaseIcon } from '@/assets/icons/disease-icon';
import { GenderIcon } from '@/assets/icons/gender-icon';
import { HealthRecordDetailIcon } from '@/assets/icons/health-record-detail-icon';
import { LocationIcon } from '@/assets/icons/location-icon';
import { countryOptions, genderOptions } from '@/constants';
import {
  BasicHealthRecordKey,
  BasicHealthRecordSchema
} from '@/features/health-record/helpers/schema';
import type {
  BasicHealthRecord,
  HealthRecord
} from '@/features/health-record/interface';
import { DatePickerInput } from '@/shared/components/blocks/DatePickerInput';
import { FormField } from '@/shared/components/blocks/FormField';
import { Picklist } from '@/shared/components/blocks/Picklist';
import { Button } from '@/shared/components/ui/Button';
import Col from '@/shared/components/ui/Col';
import { Input } from '@/shared/components/ui/Input';
import Row from '@/shared/components/ui/Row';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

interface Props {
  setPayloadBasic: (data: BasicHealthRecord) => void;
  isPending: boolean;
  isEdit?: boolean;
  initData?: HealthRecord;
}

export default function BasicInformation({
  setPayloadBasic,
  isPending,
  isEdit = false,
  initData
}: Props) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<BasicHealthRecord>({
    mode: 'onBlur',
    shouldFocusError: false,
    reValidateMode: 'onBlur',
    resolver: zodResolver(BasicHealthRecordSchema),
    defaultValues: {
      ...(isEdit
        ? {
            ...initData,
            dayOfBirth: initData?.dayOfBirth
              ? new Date(initData?.dayOfBirth)
              : undefined,
            diagnosedDisease: initData?.metadata?.diagnosedDisease
          }
        : {})
    }
  });

  const onSubmitForm = async (data: BasicHealthRecord): Promise<void> => {
    setPayloadBasic(data);
  };

  return (
    <form
      className="flex h-[calc(80vh-65px)] flex-col"
      onSubmit={handleSubmit(onSubmitForm)}
    >
      <div className="flex h-[calc(100%-81px)] flex-col gap-5 overflow-auto p-6">
        <div className="flex w-fit flex-row items-center gap-2">
          <span className="text-lg font-semibold">Basic information</span>
        </div>
        <FormField
          direction={errors.title?.message}
          id="title"
          isError={!!errors.title}
          label="Health record title"
          required
        >
          <Input
            id="title"
            leadingIcon={<HealthRecordDetailIcon className="h-[20px]" />}
            placeholder="Health record title. Whose this health record belong to?"
            {...register(BasicHealthRecordKey.Title)}
          />
        </FormField>

        <Row classes="gap-6">
          <Col classes="flex flex-col gap-1" span={6}>
            <Controller
              render={({ field }) => (
                <FormField
                  direction={errors.dayOfBirth?.message}
                  id="dob"
                  isError={!!errors.dayOfBirth}
                  label="Date of birth"
                  required
                >
                  <DatePickerInput
                    acceptRange={{ maxDate: new Date() }}
                    date={field.value ? new Date(field.value) : undefined}
                    leadingIcon={<AgeIcon />}
                    placeholder="DD/MM/YYYY"
                    setDate={field.onChange ?? null}
                  />
                </FormField>
              )}
              control={control}
              name={BasicHealthRecordKey.DOB}
            />
          </Col>
          <Col classes="flex flex-col gap-1" span={6}>
            <Controller
              render={({ field }) => (
                <FormField
                  direction={errors.sex?.message}
                  id="sex"
                  isError={!!errors.sex}
                  label="Sex"
                  required
                >
                  <Picklist
                    leadingIcon={<GenderIcon />}
                    onSetValue={(value) => field.onChange(value)}
                    options={genderOptions}
                    placeholder="Sex"
                    value={field.value}
                  />
                </FormField>
              )}
              control={control}
              name={BasicHealthRecordKey.Sex}
            />
          </Col>
        </Row>
        <Controller
          render={({ field }) => (
            <FormField
              direction={errors.country?.message}
              id="country"
              isError={!!errors.country}
              label="Country"
              required
            >
              <Picklist
                leadingIcon={<LocationIcon />}
                onSetValue={(value) => field.onChange(value)}
                options={countryOptions}
                placeholder="Country of residence"
                value={field.value}
              />
            </FormField>
          )}
          control={control}
          name={BasicHealthRecordKey.Country}
        />
        <FormField
          id="diagnosedDisease"
          label="Previously diagnosed disease (if applicable)"
        >
          <Input
            leadingIcon={<DiseaseIcon />}
            placeholder="Previously diagnosed disease"
            {...register(BasicHealthRecordKey.DiagnosedDisease)}
          />
        </FormField>
      </div>

      <div className="flex justify-end gap-3 border-t px-6 py-4">
        <Button
          isDisabled={isPending}
          size="lg"
          type="submit"
          variant="primary"
        >
          {isEdit ? 'Save' : 'Create health record'}
        </Button>
      </div>
    </form>
  );
}
