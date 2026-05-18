/* eslint-disable import/no-unresolved */
import useGetMyProfile from '@/features/account/hooks/useGetMyProfile';
import { Button } from '@/shared/components/ui/Button';
import { Plus } from 'lucide-react';

interface Props {
  onClickCreate: () => void;
}

export default function EmptyRecord({ onClickCreate }: Props) {
  const { myProfile } = useGetMyProfile();

  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex h-fit w-fit flex-col items-center justify-center">
        <img
          alt="empty"
          className="h-64 w-64 object-cover"
          src="/emty-record.png"
        />
        <div className="flex max-w-[635px] flex-col items-center justify-center gap-4">
          <h6 className="text-center">Welcome {myProfile?.profile?.name}</h6>
          <p className="text-center text-lg text-text-default">
            Get started by creating a health record and identifying potential
            rare diseases for you or your family members
          </p>
          <Button leadingIcon={<Plus />} onClick={onClickCreate} size="md">
            Create a health record
          </Button>
        </div>
      </div>
    </div>
  );
}
