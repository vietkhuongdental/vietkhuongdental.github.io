// Assets Imports
import SortIcon from '@/assets/icons/sort-icon';
import { cn } from '@/shared/libs/utils';
// Tanstack Imports
import type { Column } from '@tanstack/react-table';
// React Imports
import { useCallback } from 'react';

// Utility Imports

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export const DataTableColumnHeader = <TData, TValue>({
  column,
  title,
  className
}: DataTableColumnHeaderProps<TData, TValue>) => {
  const handleClickSorting = useCallback(() => {
    column.toggleSorting(column.getIsSorted() !== 'desc');
  }, []);

  return (
    // PHN
    <div className={cn('flex w-fit items-center', className)}>
      <span className="text-sm font-medium">{title}</span>
      {column.getCanSort() && (
        <button
          className="w-4 w-fit p-2"
          onClick={handleClickSorting}
          type="button"
        >
          <SortIcon />
        </button>
      )}
    </div>
  );
};
