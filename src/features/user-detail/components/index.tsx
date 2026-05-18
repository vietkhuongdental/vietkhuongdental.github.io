import { RoleType } from '@/constants';
import ExpertDetail from '@/features/user-detail/components/expert-detail';
import PatientDetail from '@/features/user-detail/components/patient-detail';
import useGetAccountById from '@/features/user-detail/hooks/useGetAccountById';

interface Props {
  id: string;
}

export default function UserDetail({ id }: Props) {
  const { userAccount, isLoading } = useGetAccountById({ id });

  if (isLoading || !userAccount) return null;

  if (userAccount?.role === RoleType.PATIENT) {
    return (
      <PatientDetail
        accountStatus={userAccount.status}
        email={userAccount.email}
        userProfile={userAccount?.profile}
      />
    );
  }

  return (
    <ExpertDetail
      accountStatus={userAccount.status}
      email={userAccount.email}
      userProfile={userAccount?.profileExpert}
    />
  );
}
