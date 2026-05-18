import { Button } from '@/shared/components/ui/Button';
import { useModalProvider } from '@/shared/hooks';
import { useNavigate } from 'react-router-dom';

interface Props {
  type: 'analysis' | 'health-record';
}

export default function LimitCreationModal({ type }: Props) {
  const navigate = useNavigate();
  const { onCloseModal } = useModalProvider();

  const handleClickNavigate = () => {
    onCloseModal();
    navigate('/account');
  };

  return (
    <div className="w-screen max-w-[650px] xl:w-[650px]">
      <div className="flex flex-col gap-[10px] p-6 text-text-default">
        <span className="text-sm font-normal">
          {type === 'health-record'
            ? 'Only verified patient can create more health record. Go to "Account setting" to check verification status.'
            : 'Only verified patient can have unlimited analysis. Go to "Account setting" to check verification status.'}
        </span>
      </div>
      <div className="flex items-center justify-end gap-3 border-t px-6 py-4">
        <Button
          onClick={handleClickNavigate}
          size="lg"
          type="submit"
          variant="primary"
        >
          Go to Account Setting
        </Button>
      </div>
    </div>
  );
}
