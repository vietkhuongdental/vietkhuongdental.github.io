import { Button } from '@/shared/components/ui/Button';
import { useCallback } from 'react';

interface Props {
  onClickConfirm: () => Promise<void>;
}

export default function OpenMatchingModal({ onClickConfirm }: Props) {
  const handleClickConfirm = useCallback(async () => {
    await onClickConfirm();
  }, []);

  return (
    <div className="h-fit w-screen max-w-[800px] flex-1 overflow-auto xl:w-[800px]">
      <form className="flex h-[calc(80vh-65px)] flex-col">
        <div className="flex h-[calc(100%-81px)] flex-col gap-5 overflow-auto p-6">
          <span className="text-md font-semibold text-text-default">
            Terms and Conditions:
          </span>
          <p className="text-sm font-normal">
            By opening for matching, your health records will be visible
            anonymously on our Patient Directory. Experts can find you based on
            potential diseases and send you connect request.
          </p>
          <div className="flex flex-col gap-6 bg-background-subtle p-4">
            <p className="text-md font-normal">
              <strong>1. Data Privacy:</strong> All personal identifiers will be
              removed from your data before sharing. Only{' '}
              <strong>connected experts</strong> can view your name, health
              record name and uploaded files.
            </p>
            <p className="text-md font-normal">
              <strong>2. Data Usage:</strong> Your anonymised data may be used
              for research purposes, educational content, and to improve the
              Genorare platform.
            </p>
            <p className="text-md font-normal">
              <strong>3. Revocation:</strong> You can change back to “Close for
              matching" any time.
            </p>
            <p className="text-md font-normal">
              <strong>4. Benefits:</strong> By opening for matching, experts can
              find and connect with you for more details consultations, drug
              testing invitations. You also contribute to the advancement of
              rare disease research and help others with similar conditions.
            </p>
            <p className="text-md font-normal">
              <strong>5. No Medical Advice:</strong> The information shared is
              not intended to provide medical advice. Always consult with
              healthcare professionals for medical decisions.
            </p>
            <p className="text-md font-normal">
              <strong>6. Community Guidelines:</strong> All interactions related
              to the published Health record must adhere to our community
              guidelines, which prohibit harassment, discrimination, and
              misinformation.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t px-6 py-4">
          <Button
            onClick={(e) => {
              e.preventDefault();
              handleClickConfirm();
            }}
            size="lg"
            variant="primary"
          >
            Confirm
          </Button>
        </div>
      </form>
    </div>
  );
}
