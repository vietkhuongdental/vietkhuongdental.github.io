import { GenderType } from '@/constants';
import type { ParamsProps } from '@/features/user-management/components/user-list';
import { DatePickerInput } from '@/shared/components/blocks/DatePickerInput';
import { FormField } from '@/shared/components/blocks/FormField';
import { Button } from '@/shared/components/ui/Button';
import { Checkbox } from '@/shared/components/ui/checkbox';
import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useState
} from 'react';

interface Props {
  initParams: ParamsProps;
  onSetParams: Dispatch<SetStateAction<ParamsProps>>;
  onSetIsShowFilterPopup: Dispatch<SetStateAction<boolean>>;
}

export default function FilterUserListPopup({
  initParams,
  onSetParams,
  onSetIsShowFilterPopup
}: Props) {
  const [selectedGender, setSelectedGender] = useState<string[]>(
    initParams.gender || []
  );
  const [fromCreatedDate, setFromCreatedDate] = useState<string | undefined>(
    initParams.fromCreatedDate
  );
  const [toCreatedDate, setToCreatedDate] = useState<string | undefined>(
    initParams.toCreatedDate
  );
  const [fromDob, setFromDob] = useState<string | undefined>(
    initParams.fromDob
  );
  const [toDob, setToDob] = useState<string | undefined>(initParams.toDob);
  const [fromUpdatedDate, setFromUpdatedDate] = useState<string | undefined>(
    initParams.fromUpdatedDate
  );
  const [toUpdatedDate, setToUpdatedDate] = useState<string | undefined>(
    initParams.toUpdatedDate
  );

  const handleSelectGender = (value: string) => {
    if (selectedGender.includes(value)) {
      setSelectedGender(selectedGender.filter((item) => item !== value));
    } else {
      setSelectedGender([...selectedGender, value]);
    }
  };

  const handleClearAll = useCallback(() => {
    setSelectedGender([]);
    setFromCreatedDate(undefined);
    setToCreatedDate(undefined);
    setFromDob(undefined);
    setToDob(undefined);
    setFromUpdatedDate(undefined);
    setToUpdatedDate(undefined);
  }, []);

  const handleApplyFilter = useCallback(() => {
    onSetParams({
      gender: selectedGender,
      fromCreatedDate,
      toCreatedDate,
      fromDob,
      toDob,
      fromUpdatedDate,
      toUpdatedDate
    });
    onSetIsShowFilterPopup(false);
  }, [
    selectedGender,
    fromCreatedDate,
    toCreatedDate,
    fromDob,
    toDob,
    fromUpdatedDate,
    toUpdatedDate
  ]);

  return (
    <div className="flex max-h-[65vh] flex-col">
      <div className="flex flex-1 flex-col overflow-auto p-4">
        <div className="border-b py-2">
          <FormField id="gender" label="Giới tính">
            <div className="flex flex-col gap-2">
              <div className="flex flex-row items-center gap-2">
                <Checkbox
                  checked={selectedGender.includes(GenderType.Nam)}
                  id="gender-nam"
                  onChange={() => handleSelectGender(GenderType.Nam)}
                />
                <label
                  className="text-md text-text-description"
                  htmlFor="gender-nam"
                >
                  Nam
                </label>
              </div>
              <div className="flex flex-row items-center gap-2">
                <Checkbox
                  checked={selectedGender.includes(GenderType.Nữ)}
                  id="gender-nu"
                  onChange={() => handleSelectGender(GenderType.Nữ)}
                />
                <label
                  className="text-md text-text-description"
                  htmlFor="gender-nu"
                >
                  Nữ
                </label>
              </div>
            </div>
          </FormField>
        </div>

        <div className="border-b py-2">
          <FormField id="createdDate" label="Ngày tạo">
            <div className="flex flex-row items-center gap-2">
              <DatePickerInput
                acceptRange={{
                  maxDate: toCreatedDate ? new Date(toCreatedDate) : undefined
                }}
                date={fromCreatedDate ? new Date(fromCreatedDate) : undefined}
                placeholder="From"
                setDate={setFromCreatedDate}
                size="md"
              />
              <span className="text-text-description">–</span>
              <DatePickerInput
                acceptRange={{
                  minDate: fromCreatedDate
                    ? new Date(fromCreatedDate)
                    : undefined
                }}
                date={toCreatedDate ? new Date(toCreatedDate) : undefined}
                placeholder="To"
                setDate={setToCreatedDate}
                size="md"
              />
            </div>
          </FormField>
        </div>

        <div className="border-b py-2">
          <FormField id="dob" label="Ngày sinh">
            <div className="flex flex-row items-center gap-2">
              <DatePickerInput
                acceptRange={{ maxDate: toDob ? new Date(toDob) : undefined }}
                date={fromDob ? new Date(fromDob) : undefined}
                placeholder="From"
                setDate={setFromDob}
                size="md"
              />
              <span className="text-text-description">–</span>
              <DatePickerInput
                acceptRange={{
                  minDate: fromDob ? new Date(fromDob) : undefined
                }}
                date={toDob ? new Date(toDob) : undefined}
                placeholder="To"
                setDate={setToDob}
                size="md"
              />
            </div>
          </FormField>
        </div>

        <div className="border-b py-2">
          <FormField id="updatedDate" label="Ngày hoạt động gần nhất">
            <div className="flex flex-row items-center gap-2">
              <DatePickerInput
                acceptRange={{
                  maxDate: toUpdatedDate ? new Date(toUpdatedDate) : undefined
                }}
                date={fromUpdatedDate ? new Date(fromUpdatedDate) : undefined}
                placeholder="From"
                setDate={setFromUpdatedDate}
                size="md"
              />
              <span className="text-text-description">–</span>
              <DatePickerInput
                acceptRange={{
                  minDate: fromUpdatedDate
                    ? new Date(fromUpdatedDate)
                    : undefined
                }}
                date={toUpdatedDate ? new Date(toUpdatedDate) : undefined}
                placeholder="To"
                setDate={setToUpdatedDate}
                size="md"
              />
            </div>
          </FormField>
        </div>
      </div>
      <div className="flex h-fit flex-row justify-between border-t px-4 py-2">
        <Button
          className="text-text-disable"
          onClick={handleClearAll}
          size="md"
          variant="ghost"
        >
          Xoá lọc
        </Button>
        <Button onClick={handleApplyFilter} size="md" variant="primary">
          Áp dụng
        </Button>
      </div>
    </div>
  );
}
