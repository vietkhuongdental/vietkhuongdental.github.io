import { usePostCancelDelete } from '@/features/auth/login/hooks/api/usePostCancelDelete';
import { Button } from '@/shared/components/ui/Button';
import { useToastProvider } from '@/shared/hooks';
import { ChevronLeft } from 'lucide-react';
import type { Dispatch, SetStateAction } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  email: string;
  onSetIsDoneRequest: Dispatch<SetStateAction<boolean>>;
}

export default function WelcomeBack({ email, onSetIsDoneRequest }: Props) {
  const { showToast } = useToastProvider();
  const navigate = useNavigate();
  const { onPostCancelDelete, isPending } = usePostCancelDelete(
    { email },
    {
      onSuccess: () => {
        onSetIsDoneRequest(true);
      },
      onError: () => {
        showToast({
          title: 'Error happened. Please try again',
          variant: 'error'
        });
        setTimeout(() => {
          navigate('/auth/login');
        }, 1000);
      }
    }
  );

  const handleClickCancelRequest = async () => {
    await onPostCancelDelete();
  };

  return (
    <div className="flex h-screen flex-col gap-10">
      <Button
        className="flex w-fit justify-start p-0 hover:bg-background-default"
        leadingIcon={<ChevronLeft />}
        onClick={() => navigate('/')}
        variant="ghost"
      >
        Back
      </Button>
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold">Welcome back</h1>
        <p className="text-text-default">
          We're sorry to see you go! Your account is processing for delete
          request. However, you have{' '}
          <strong className="font-bold">14 days left</strong> to change your
          mind. If you decide to return, click Cancel delete request button
          below.
        </p>

        <Button
          className="w-full"
          disabled={isPending}
          onClick={handleClickCancelRequest}
          size="lg"
        >
          Cancel Delete Request
        </Button>
      </div>
    </div>
  );
}
