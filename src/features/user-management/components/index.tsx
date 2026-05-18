import UserList from '@/features/user-management/components/user-list';
import { useGetListUsers } from '@/features/user-management/hooks/api/useGetUserList';

export default function UserManagement() {
  const {
    data: userManagementData,
    inputSearch,
    isFetching,
    setParams,
    setInputSearch
  } = useGetListUsers();

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-full flex-col items-center justify-start rounded-2xl bg-background-default">
        <UserList
          inputSearch={inputSearch}
          isLoading={isFetching}
          onSetInputSearch={setInputSearch}
          onSetParams={setParams}
          userManagementData={userManagementData || undefined}
        />
      </div>
    </div>
  );
}
