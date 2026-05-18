import { countryOptions } from '@/constants';
import type { ParamsProps } from '@/features/patient-directory/components/patient-list';
import { FormField } from '@/shared/components/blocks/FormField';
import { MultiPicklist } from '@/shared/components/blocks/MultiPicklist';
import { Button } from '@/shared/components/ui/Button';
import { Checkbox } from '@/shared/components/ui/checkbox';
import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useMemo,
  useState
} from 'react';

interface Props {
  initParams: ParamsProps;
  onSetParams: Dispatch<SetStateAction<ParamsProps>>;
  onSetIsShowFilterPopup: Dispatch<SetStateAction<boolean>>;
}

export default function FilterPatientListPopup({
  initParams,
  onSetParams,
  onSetIsShowFilterPopup
}: Props) {
  const [selectedCountries, setSelectedCountries] = useState<string[]>(
    initParams?.country || []
  );
  const [selectedSex, setSelectedSex] = useState<string[]>(
    initParams.sex || []
  );
  const [selectedAgeRange, setSelectedAgeRange] = useState<string[]>(
    initParams.ageRange
      ? initParams.ageRange?.map(({ minAge, maxAge }) => `${minAge}-${maxAge}`)
      : []
  );
  const [inputSearchCountry, setInputSearchCountry] = useState('');

  const filterCountryOptions = useMemo(
    () =>
      countryOptions.filter((option) =>
        option.value.toLowerCase().includes(inputSearchCountry.toLowerCase())
      ),
    [inputSearchCountry]
  );

  const handleSelectCountry = (value: string[]) => {
    setSelectedCountries(value);
  };

  const handleSelectSex = (value: string) => {
    let updatedSelectedSex: string[];

    if (selectedSex.includes(value)) {
      // remove
      updatedSelectedSex = selectedSex.filter((item) => item !== value);
    } else {
      // add
      updatedSelectedSex = [...selectedSex, value];
    }

    setSelectedSex(updatedSelectedSex);
  };

  const handleSelectAgeRange = (value: string) => {
    let updatedSelectedAgeRange: string[];

    if (selectedAgeRange.includes(value)) {
      // remove
      updatedSelectedAgeRange = selectedAgeRange.filter(
        (item) => item !== value
      );
    } else {
      // add
      updatedSelectedAgeRange = [...selectedAgeRange, value];
    }

    setSelectedAgeRange(updatedSelectedAgeRange);
  };

  const handleClearAll = useCallback(() => {
    setSelectedCountries([]);
    setSelectedSex([]);
    setSelectedAgeRange([]);
  }, []);

  const handleApplyFilter = useCallback(() => {
    const ageRange = selectedAgeRange.map((range) => {
      const [minAge, maxAge] = range.split('-').map(Number);
      return { minAge, maxAge };
    });
    onSetParams({ country: selectedCountries, sex: selectedSex, ageRange });
    onSetIsShowFilterPopup(false);
  }, [selectedCountries, selectedSex, selectedAgeRange]);

  return (
    <div className="flex max-h-[45vh] flex-col">
      <div className="flex-1 flex-col overflow-auto p-4">
        {/* Country */}
        <div className="border-b pb-2">
          <FormField id="country" label="Country">
            <MultiPicklist
              allowLazyLoad={false}
              className="w-full"
              onChange={handleSelectCountry}
              onSetInputSearch={setInputSearchCountry}
              options={filterCountryOptions}
              placeholder="Search country"
              value={selectedCountries}
            />
          </FormField>
        </div>
        <div className="border-b py-2">
          <FormField id="sex" label="Sex">
            <div className="flex flex-col gap-2">
              <div className="flex flex-row items-center gap-2">
                <Checkbox
                  checked={selectedSex.includes('Male')}
                  id="terms"
                  onChange={() => handleSelectSex('Male')}
                />
                <label
                  className="text-center text-md text-text-description"
                  htmlFor="condition"
                >
                  Male
                </label>
              </div>
              <div className="flex flex-row items-center gap-2">
                <Checkbox
                  checked={selectedSex.includes('Female')}
                  id="terms"
                  onChange={() => handleSelectSex('Female')}
                />
                <label
                  className="text-md text-text-description"
                  htmlFor="condition"
                >
                  Female
                </label>
              </div>
              <div className="flex flex-row items-center gap-2">
                <Checkbox
                  checked={selectedSex.includes('Prefer not to tell')}
                  id="terms"
                  onChange={() => handleSelectSex('Prefer not to tell')}
                />
                <label
                  className="text-md text-text-description"
                  htmlFor="condition"
                >
                  Prefer not to tell
                </label>
              </div>
            </div>
          </FormField>
        </div>
        <div className="pt-2">
          <FormField id="age" label="Age Range">
            <div className="flex flex-col gap-2">
              <div className="flex flex-row items-center gap-2">
                <Checkbox
                  checked={selectedAgeRange.includes('0-9')}
                  id="terms"
                  onChange={() => handleSelectAgeRange('0-9')}
                />
                <label
                  className="text-center text-md text-text-description"
                  htmlFor="condition"
                >
                  Child 0-9
                </label>
              </div>
              <div className="flex flex-row items-center gap-2">
                <Checkbox
                  checked={selectedAgeRange.includes('10-17')}
                  id="terms"
                  onChange={() => handleSelectAgeRange('10-17')}
                />
                <label
                  className="text-md text-text-description"
                  htmlFor="condition"
                >
                  Teen 10-17
                </label>
              </div>
              <div className="flex flex-row items-center gap-2">
                <Checkbox
                  checked={selectedAgeRange.includes('18-29')}
                  id="terms"
                  onChange={() => handleSelectAgeRange('18-29')}
                />
                <label
                  className="text-md text-text-description"
                  htmlFor="condition"
                >
                  Young Adult 18-29
                </label>
              </div>
              <div className="flex flex-row items-center gap-2">
                <Checkbox
                  checked={selectedAgeRange.includes('30-44')}
                  id="terms"
                  onChange={() => handleSelectAgeRange('30-44')}
                />
                <label
                  className="text-md text-text-description"
                  htmlFor="condition"
                >
                  Average Adult 30-44
                </label>
              </div>
              <div className="flex flex-row items-center gap-2">
                <Checkbox
                  checked={selectedAgeRange.includes('45-64')}
                  id="terms"
                  onChange={() => handleSelectAgeRange('45-64')}
                />
                <label
                  className="text-md text-text-description"
                  htmlFor="condition"
                >
                  Middle Adult 45-64
                </label>
              </div>
              <div className="flex flex-row items-center gap-2">
                <Checkbox
                  checked={selectedAgeRange.includes('65-100')}
                  id="terms"
                  onChange={() => handleSelectAgeRange('65-100')}
                />
                <label
                  className="text-md text-text-description"
                  htmlFor="condition"
                >
                  Older Adult 65+
                </label>
              </div>
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
          Clear selection
        </Button>
        <Button onClick={handleApplyFilter} size="md" variant="primary">
          Apply filter
        </Button>
      </div>
    </div>
  );
}
