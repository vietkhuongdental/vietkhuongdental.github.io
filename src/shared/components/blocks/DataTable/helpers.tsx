/* eslint-disable @typescript-eslint/no-explicit-any */
import type { SortingState, TableState } from '@tanstack/react-table';

/* eslint-disable @typescript-eslint/naming-convention */
export const configs = {
  ROWS_PER_PAGE: 10
};

export const getInitialState = (
  initialState?: Partial<TableState>
): Partial<TableState> =>
  // searchParams: URLSearchParams  --> use later
  {
    const sortOrder = initialState?.sorting || ([] as SortingState);

    return {
      globalFilter: initialState?.globalFilter, // search
      sorting: sortOrder,
      pagination: initialState?.pagination
        ? {
            pageIndex: initialState?.pagination?.pageIndex || 0,
            pageSize:
              initialState?.pagination?.pageSize || configs.ROWS_PER_PAGE
          }
        : undefined
    };
  };

export const getAdditionalFilterParams = (
  filterMap?: Record<string, unknown>
) =>
  filterMap
    ? Object.entries(filterMap).reduce(
        (state, [key, value]) => ({
          ...state,
          [key]: value
        }),
        {}
      )
    : undefined;

export interface TableParams {
  search?: string;
  offset?: number;
  limit?: number;
  orderBy?: string;
  [key: string]: boolean | number | string | string[] | undefined;
}

export function getPaginationRange(
  currentPage: number,
  totalPages: number,
  siblingCount = 1
): (number | string)[] {
  const totalNumbers = siblingCount * 2 + 5; // first, last, current, siblings, 2 ellipses

  if (totalPages <= totalNumbers) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSibling = Math.max(currentPage - siblingCount, 1);
  const rightSibling = Math.min(currentPage + siblingCount, totalPages);

  const showLeftDots = leftSibling > 2;
  const showRightDots = rightSibling < totalPages - 1;

  if (!showLeftDots && showRightDots) {
    const leftRange = Array.from(
      { length: 3 + siblingCount * 2 },
      (_, i) => i + 1
    );
    return [...leftRange, '...', totalPages];
  }

  if (showLeftDots && !showRightDots) {
    const rightRange = Array.from(
      { length: 3 + siblingCount * 2 },
      (_, i) => totalPages - (3 + siblingCount * 2) + i + 1
    );
    return [1, '...', ...rightRange];
  }

  const middleRange = Array.from(
    { length: siblingCount * 2 + 1 },
    (_, i) => leftSibling + i
  );
  return [1, '...', ...middleRange, '...', totalPages];
}
