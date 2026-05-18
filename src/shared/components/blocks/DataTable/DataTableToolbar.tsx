// React Imports
import { Input } from '@/shared/components/ui/Input';
import type { Table } from '@tanstack/react-table';
import { debounce } from 'lodash-es';
import { SearchIcon } from 'lucide-react';
import type { Dispatch, SetStateAction } from 'react';
import { useCallback, useMemo } from 'react';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  searchColumn: string;
  className?: string;
  onSearch: Dispatch<SetStateAction<string>>;
}

const DataTableToolbar = <TData,>({
  table,
  searchColumn,
  className,
  onSearch
}: DataTableToolbarProps<TData>) => {
  const searchColumnHeader = useMemo(() => {
    const column = table.getColumn(searchColumn);
    return (column?.columnDef.meta?.title as string) ?? '';
  }, [table, searchColumn]);

  const handleSearch = useCallback(
    (value: string) => onSearch(value),
    [searchColumn]
  );

  return (
    <div className={className}>
      {/* Search bar */}
      <Input
        className="h-8 w-[150px] lg:w-[250px]"
        onChange={debounce((e) => handleSearch(e.target.value), 300)}
        placeholder={`Search by ${searchColumnHeader}`}
        trailingIcon={<SearchIcon />}
      />
    </div>
  );
};

export default DataTableToolbar;
