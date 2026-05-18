/* eslint-disable @typescript-eslint/no-explicit-any */
import type { PicklistOption } from '@/shared/components/blocks/Picklist';
import { combineInitialOptions } from '@/shared/libs/utils';
import { useEffect, useMemo, useState } from 'react';

interface Props<T> {
  data: T[];
  convertDataToOptions: (data: T[]) => PicklistOption[];
}

export const useMultiPicklist = <T>({
  data,
  convertDataToOptions
}: Props<T>) => {
  const [selectedData, setSelectedData] = useState<string[]>([]);

  const [allFetchedDataOptions, setAllFetchedDataOptions] = useState(
    convertDataToOptions(data)
  );

  const selectedDataOptions = useMemo(
    () =>
      allFetchedDataOptions.filter((option) =>
        selectedData.includes(option.value)
      ),
    [selectedData, allFetchedDataOptions]
  );

  const combineInitOptions = useMemo(
    () =>
      combineInitialOptions({
        newFetchedOptions: convertDataToOptions(data),
        selectedOptions: selectedDataOptions
      }),
    [allFetchedDataOptions, selectedDataOptions]
  );

  useEffect(() => {
    const newOptions = convertDataToOptions(data);
    setAllFetchedDataOptions((prev) => {
      const merged = [...prev, ...newOptions];
      const unique = Array.from(
        new Map(merged.map((item) => [item.value, item])).values()
      );
      return unique;
    });
  }, [data]);

  return {
    selectedData,
    setSelectedData,
    combineInitOptions,
    selectedDataOptions,
    allFetchedDataOptions
  };
};
