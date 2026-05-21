import PaginateLeftIcon from '@/assets/icons/paginate-left-icon';
import PaginateRightIcon from '@/assets/icons/paginate-right-icon';
import { getPaginationRange } from '@/shared/components/blocks/DataTable/helpers';
import type { Table } from '@tanstack/react-table';

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100, 200, 500, 1000];

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  onPageChange: (newPage: number) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
}

const DataTablePagination = <TData,>({
  table,
  onPageChange,
  pageSize,
  onPageSizeChange
}: DataTablePaginationProps<TData>) => {
  // Calculate visible page range
  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = table.getPageCount();
  const pages = getPaginationRange(currentPage, totalPages);

  return (
    <>
      <div className="flex items-center justify-between px-2 py-4">
        <div className="text-text-secondary flex items-center gap-2 text-sm">
          <span>Rows per page:</span>
          <select
            className="rounded-lg border px-2 py-1 text-sm focus:outline-none"
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            value={pageSize}
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <button
            className={`flex h-8 w-8 items-center rounded-xl border hover:bg-button-outlineInverse-fg-default ${
              currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''
            }`}
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            <PaginateLeftIcon />
          </button>
          {pages.map((p, idx) =>
            typeof p === 'string' ? (
              <span className="px-2 text-gray-400" key={idx}>
                …
              </span>
            ) : (
              <button
                className={`flex h-8 w-8 items-center justify-center rounded-lg border ${
                  p === currentPage
                    ? 'bg-background-secondary text-white'
                    : 'hover:bg-button-secondary-bg-hover hover:text-white'
                }`}
                key={idx}
                onClick={() => onPageChange(p)}
              >
                {p}
              </button>
            )
          )}
          <button
            className={`flex h-8 w-8 items-center rounded-lg border hover:bg-button-outlineInverse-fg-default ${
              currentPage === totalPages ? 'cursor-not-allowed opacity-50' : ''
            }`}
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            <PaginateRightIcon />
          </button>
        </div>
      </div>
    </>
  );
};

export default DataTablePagination;
