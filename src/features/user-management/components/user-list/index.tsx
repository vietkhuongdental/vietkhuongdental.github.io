import { SearchIcon } from '@/assets/icons/search-icon';
import FilterUserListPopup from '@/features/user-management/components/filter-user-list-popup';
import SendMessageModal from '@/features/user-management/components/send-message-modal';
import { useUserListColumns } from '@/features/user-management/hooks/views/useUserListColumns';
import type { UserResponse } from '@/features/user-management/interface';
import { DataTable } from '@/shared/components/blocks/DataTable';
import { DataTableFilterCmp } from '@/shared/components/blocks/DataTable/DataTableFilterCmp';
import type { TableParams } from '@/shared/components/blocks/DataTable/helpers';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { useModalProvider } from '@/shared/hooks';
import type { ApiPaginationData } from '@/shared/services/http/helpers';
import { isEmpty } from 'lodash-es';
import { MessageSquareMoreIcon } from 'lucide-react';
import type { Dispatch, SetStateAction } from 'react';
import { useMemo, useState } from 'react';

export interface ParamsProps extends Record<string, unknown> {
  search?: string;
  gender?: string[];
  fromCreatedDate?: string;
  toCreatedDate?: string;
  fromDob?: string;
  toDob?: string;
  fromUpdatedDate?: string;
  toUpdatedDate?: string;
}

interface Props {
  userManagementData?: ApiPaginationData<UserResponse[]>;
  isLoading?: boolean;
  inputSearch: string;
  onSetParams: Dispatch<SetStateAction<TableParams>>;
  onSetInputSearch: Dispatch<SetStateAction<string>>;
  onRefetch?: () => void;
}

export default function UserList({
  userManagementData,
  isLoading = false,
  inputSearch,
  onSetParams,
  onSetInputSearch,
  onRefetch
}: Props) {
  const { onShowModal } = useModalProvider();

  const allIds = useMemo(
    () =>
      (userManagementData?.data ?? []).map((u) => u.id ?? '').filter(Boolean),
    [userManagementData?.data]
  );

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const handleToggleRow = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  };

  const handleToggleAll = () => {
    setSelectedIds((prev) => {
      const isAllSelected = allIds.every((id) => prev.has(id));

      if (isAllSelected) {
        return new Set();
      }

      return new Set(allIds);
    });
  };

  const { columns } = useUserListColumns({
    selectedIds,
    allIds,
    onToggleRow: handleToggleRow,
    onToggleAll: handleToggleAll
  });

  const selectedUsers = useMemo(
    () =>
      (userManagementData?.data ?? []).filter((u) =>
        selectedIds.has(u.id ?? '')
      ),
    [userManagementData?.data, selectedIds]
  );

  const handleOpenSendMessage = () => {
    void onShowModal({
      title: 'Gửi tin',
      hideButton: true,
      children: (
        <SendMessageModal
          onDoneSendMessages={() => {
            onRefetch?.();
          }}
          selectedUsers={selectedUsers}
        />
      )
    });
  };

  const [additionalFilterParams, setAdditionalFilterParams] =
    useState<ParamsProps>({} as ParamsProps);

  const [isShowFilterPopup, setIsShowFilterPopup] = useState(false);

  const handleGetData = (params?: TableParams) => {
    onSetParams({ ...params });
  };

  return (
    <div className="flex h-[calc(100vh-100px)] w-full flex-col overflow-hidden rounded-2xl bg-background-default">
      <div className="flex min-h-0 flex-1 flex-col gap-1">
        <div className="flex w-full flex-row justify-between gap-2 px-6 py-4">
          <div className="flex flex-row items-center gap-3">
            <span className="text-lg font-bold text-text-default">
              {userManagementData?.page?.total || 0} Users
            </span>
            {selectedIds.size > 0 && (
              <Button
                onClick={handleOpenSendMessage}
                size="md"
                type="button"
                variant="primary"
              >
                <MessageSquareMoreIcon className="mr-2 h-4 w-4" />
                Gửi tin ({selectedIds.size})
              </Button>
            )}
          </div>
          <div className="flex flex-row gap-3">
            <Input
              onChange={(e) => {
                onSetInputSearch(e.target.value);
              }}
              leadingIcon={<SearchIcon />}
              placeholder="Tìm kiếm theo tên, sđt"
              value={inputSearch}
            />
            <DataTableFilterCmp
              isFiltering={
                !isEmpty(additionalFilterParams.gender) ||
                !!additionalFilterParams.fromCreatedDate ||
                !!additionalFilterParams.toCreatedDate ||
                !!additionalFilterParams.fromDob ||
                !!additionalFilterParams.toDob ||
                !!additionalFilterParams.fromUpdatedDate ||
                !!additionalFilterParams.toUpdatedDate
              }
              maintContent={
                <FilterUserListPopup
                  initParams={additionalFilterParams}
                  onSetIsShowFilterPopup={setIsShowFilterPopup}
                  onSetParams={setAdditionalFilterParams}
                />
              }
              isOpen={isShowFilterPopup}
              setIsOpen={setIsShowFilterPopup}
            />
          </div>
        </div>
        <div className="flex min-h-0 flex-1 flex-col gap-4 border-t px-6 pb-6">
          <DataTable
            initialState={{
              pagination: {
                pageIndex: 0,
                pageSize: 1000
              },
              sorting: [
                {
                  desc: true,
                  id: 'updatedDate'
                }
              ]
            }}
            additionalFilterParams={additionalFilterParams}
            columns={columns}
            data={userManagementData?.data || []}
            externalPageReset={inputSearch}
            isLoading={isLoading}
            onAction={handleGetData}
            page={userManagementData?.page}
          />
        </div>
      </div>
    </div>
  );
}
