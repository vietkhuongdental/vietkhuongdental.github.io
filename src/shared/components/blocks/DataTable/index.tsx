/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Loading } from '@/shared/components/blocks/DataTable/Loading';
import type { TableParams } from '@/shared/components/blocks/DataTable/helpers';
import {
  configs,
  getAdditionalFilterParams,
  getInitialState
} from '@/shared/components/blocks/DataTable/helpers';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/shared/components/ui/Table/index';
import { cn } from '@/shared/libs/utils';
import type { PaginationResponseType } from '@/shared/services/http';
import type {
  ColumnDef,
  PaginationState,
  SortingState,
  TableState
} from '@tanstack/react-table';
import {
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table';
import { isEmpty } from 'lodash-es';
import { useEffect, useMemo, useState } from 'react';

import DataTablePagination from './DataTablePagination';
import DataTableToolbar from './DataTableToolbar';

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  isLoading?: boolean;
  page?: PaginationResponseType;
  searchColumn?: string;
  className?: string;
  initialState?: Partial<TableState>; // {sorting:..., globalFilter:...,  pagination:...} // usually undefined --> auto = first page
  additionalFilterParams?: Record<string, unknown>;
  onAction?: (params: TableParams) => void;
  /** When this value changes the page index is reset to 0 (e.g. pass the search term). */
  externalPageReset?: unknown;
}

export const DataTable = <TData,>({
  columns,
  data,
  isLoading = false,
  page,
  searchColumn,
  className,
  initialState,
  additionalFilterParams,
  onAction,
  externalPageReset
}: DataTableProps<TData>) => {
  // const [rowSelection, setRowSelection] = useState({});
  // const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  // const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const dataTable = useMemo(() => data ?? [], [data]);

  const initialStates = useMemo(
    () => getInitialState(initialState),
    [initialState]
  );
  const [sorting, setSorting] = useState<SortingState>(
    initialStates?.sorting || []
  );

  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: +(initialStates?.pagination?.pageIndex || 0),
    pageSize: +(initialStates?.pagination?.pageSize || configs.ROWS_PER_PAGE)
  });

  const [search, setSearch] = useState<string>(
    () => initialStates.globalFilter
  );

  const handleChangePage = (pageNumber: number) => {
    setPaginationState((prev) => ({ ...prev, pageIndex: pageNumber - 1 }));
  };

  const handlePageSizeChange = (newSize: number) => {
    setPaginationState({ pageIndex: 0, pageSize: newSize });
  };

  // Reset to first page whenever externalPageReset changes (e.g. search term).
  useEffect(() => {
    setPaginationState((prev) => ({ ...prev, pageIndex: 0 }));
  }, [externalPageReset]);

  useEffect(() => {
    if (!onAction) return;

    const params: TableParams = {
      ...getAdditionalFilterParams(additionalFilterParams),
      search: search ? search.toString() : undefined,
      offset: initialStates.pagination
        ? paginationState.pageIndex * paginationState.pageSize
        : undefined,
      limit: initialStates.pagination ? paginationState.pageSize : undefined,
      orderBy: sorting?.[0]?.id ? sorting[0].id : undefined,
      sortBy: sorting?.[0]?.desc ? 'DESC' : 'ASC'
    };

    onAction(params);
  }, [paginationState, additionalFilterParams, sorting, search]);

  const table = useReactTable({
    data: dataTable,
    columns,
    pageCount: page ? Math.ceil(page.total / page.size) : 1,
    state: {
      sorting,
      pagination: paginationState
      // columnVisibility
      // rowSelection,
      // columnFilters
    },
    // onPaginationChange: setPaginationState,
    // enableRowSelection: true,
    // onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    // onColumnFiltersChange: setColumnFilters,
    // onColumnVisibilityChange: setColumnVisibility,

    //Advanced
    getCoreRowModel: getCoreRowModel()
    // getFilteredRowModel: getFilteredRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
    // getSortedRowModel: getSortedRowModel(),
    // getFacetedRowModel: getFacetedRowModel(),
    // getFacetedUniqueValues: getFacetedUniqueValues()
  });

  const tableRows = table.getRowModel().rows;

  return (
    <div className="flex h-full flex-col space-y-4">
      {searchColumn ? (
        <DataTableToolbar
          className="flex flex-1 justify-end"
          onSearch={setSearch}
          searchColumn={searchColumn}
          table={table}
        />
      ) : null}
      <div className={cn('min-h-0 flex-1 overflow-auto', className)}>
        <Table>
          <TableHeader className="sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup, groupIndex) => (
              <TableRow
                className={cn(groupIndex === 0 && 'bg-muted')}
                key={headerGroup.id}
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    className={cn(
                      'border border-border-disabled bg-background-solid px-4'
                      // // Optional: Add top rounded corners to first row’s first and last cells
                      // groupIndex === 0 && headerIndex === 0 && 'rounded-tl-2xl',
                      // groupIndex === 0 &&
                      //   headerIndex === headers.length - 1 &&
                      //   'rounded-tr-2xl'
                    )}
                    colSpan={header.colSpan}
                    key={header.id}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {tableRows?.length ? (
              tableRows.map((row) => {
                // const isLastRow = rowIndex === tableRows.length - 1;
                const visibleCells = row.getVisibleCells();

                return (
                  <TableRow
                    data-state={row.getIsSelected() && 'selected'}
                    key={row.id}
                  >
                    {visibleCells.map((cell) => (
                      <TableCell
                        className={cn(
                          'w-fit border px-4'
                          // !hasPagination &&
                          //   isLastRow &&
                          //   cellIndex === 0 &&
                          //   'rounded-bl-2xl',
                          // !hasPagination &&
                          //   isLastRow &&
                          //   cellIndex === visibleCells.length - 1 &&
                          //   'rounded-br-2xl'
                        )}
                        key={cell.id}
                      >
                        <div className="w-full">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  className="h-24 text-center"
                  colSpan={columns.length}
                >
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center gap-2 p-5">
                      <Loading />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-2 p-5">
                      <img
                        alt="empty"
                        className="w-[200px] object-cover"
                        src="/empty-information.png"
                      />
                      <span className="text-md">No information</span>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination — outside the scroll area so it stays visible */}
      {!isEmpty(initialStates.pagination) && tableRows?.length ? (
        <div className="shrink-0 border-t">
          <DataTablePagination
            onPageChange={handleChangePage}
            onPageSizeChange={handlePageSizeChange}
            pageSize={paginationState.pageSize}
            table={table}
          />
        </div>
      ) : null}
    </div>
  );
};
