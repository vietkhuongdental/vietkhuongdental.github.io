import { RoleType } from '@/constants';
import type { UserResponse } from '@/features/user-management/interface';
import { DataTableColumnHeader } from '@/shared/components/blocks/DataTable/DataTableColumnHeader';
import { Tag } from '@/shared/components/ui/Tag';
import { getStatusColor } from '@/shared/components/ui/Tag/helper';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { formattedDate } from '@/shared/libs/utils';
import { configs } from '@/shared/services/http/configs';
import type { ColumnDef } from '@tanstack/react-table';

interface Props {
  selectedIds: Set<string>;
  allIds: string[];
  onToggleRow: (id: string) => void;
  onToggleAll: () => void;
}

export const useUserListColumns = ({
  selectedIds,
  allIds,
  onToggleRow,
  onToggleAll
}: Props) => {
  const isAllSelected =
    allIds.length > 0 && allIds.every((id) => selectedIds.has(id));
  const isSomeSelected = allIds.some((id) => selectedIds.has(id));

  const columns: ColumnDef<UserResponse>[] = [
    {
      id: 'select',
      header: () => (
        <div className="flex w-full justify-center">
          <Checkbox
            checked={isAllSelected}
            indeterminate={isSomeSelected && !isAllSelected ? true : undefined}
            onChange={onToggleAll}
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex w-full justify-center">
          <Checkbox
            checked={selectedIds.has(row.original.id ?? '')}
            onChange={() => onToggleRow(row.original.id ?? '')}
          />
        </div>
      ),
      enableSorting: false
    },
    {
      accessorKey: 'fullName',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tên khách hàng" />
      ),
      cell: ({ row }) => (
        <div className="flex flex-row gap-2">
          <div className="aspect-square w-8">
            <img
              src={
                row.original?.role === RoleType.EXPERT
                  ? row.original?.profilePicture || '/anonymous-avatar.png'
                  : '/anonymous-avatar.png'
              }
              alt="User Avatar"
              className="h-8 w-8 rounded-full object-cover"
            />
          </div>
          <span className="whitespace-nowrap px-2 text-md font-semibold text-text-info">
            <a
              href={`https://oa.zalo.me/chat?uid=${row.original.zaloUserId}&oaid=${configs.ZALO_OAID}`}
            >
              {row.original.fullName}
            </a>
          </span>
        </div>
      ),
      enableSorting: false
    },
    // {
    //   accessorKey: 'zaloName',
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title="Zalo Name" />
    //   ),
    //   cell: ({ row }) => (
    //     <span className="whitespace-nowrap text-md">
    //       {row.original.zaloName || '-'}
    //     </span>
    //   ),
    //   enableSorting: false
    // },
    {
      accessorKey: 'phone',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Số điện thoại" />
      ),
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-md">
          {row.original.phone || '-'}
        </span>
      ),
      enableSorting: false
    },
    {
      accessorKey: 'address',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Địa chỉ" />
      ),
      cell: ({ row }) => (
        <div className="w-[300px]">
          <span className="whitespace-wrap text-md">
            {row.original.address || '-'}
          </span>
        </div>
      ),
      enableSorting: false
    },
    {
      accessorKey: 'dob',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Ngày sinh" />
      ),
      cell: ({ row }) => (
        <div className="w-[100px]">
          <span className="whitespace-nowrap text-md">
            {row.original.dob ? formattedDate(row.original.dob) : '-'}
          </span>
        </div>
      ),
      enableSorting: true,
      sortDescFirst: true
    },

    {
      accessorKey: 'gender',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Giới tính" />
      ),
      cell: ({ row }) => (
        <div className="w-[60px]">
          <Tag
            color={getStatusColor(row.original.gender)}
            label={row.original.gender || '-'}
            size="sm"
            variant="filled"
          />
        </div>
      ),
      enableSorting: false
    },
    {
      accessorKey: 'createdDate',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Ngày tạo" />
      ),
      cell: ({ row }) => (
        <div className="w-[100px]">
          <span className="whitespace-nowrap text-md">
            {row.original.createdDate
              ? formattedDate(row.original.createdDate)
              : '-'}
          </span>
        </div>
      ),
      enableSorting: true,
      sortDescFirst: true
    },
    {
      accessorKey: 'updatedDate',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Hoạt động gần nhất" />
      ),
      cell: ({ row }) => (
        <div className="w-[170px]">
          <span className="whitespace-nowrap text-md">
            {row.original.updatedDate
              ? formattedDate(row.original.updatedDate)
              : '-'}
          </span>
        </div>
      ),
      enableSorting: true,
      sortDescFirst: true
    }
  ];

  return {
    columns
  };
};
