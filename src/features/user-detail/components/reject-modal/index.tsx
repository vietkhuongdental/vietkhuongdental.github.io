import { VerifyProfileStatus } from '@/constants';
import { RejectSchema } from '@/features/user-detail/components/reject-modal/helper';
import { FormField } from '@/shared/components/blocks/FormField';
import { Button } from '@/shared/components/ui/Button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface Props {
  onConfirm: (payload: {
    comment?: string;
    status: VerifyProfileStatus;
  }) => void;
  onCancel: () => void;
}

export default function RejectModal({ onConfirm, onCancel }: Props) {
  const [isPending, setIsPending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<{ comment: string }>({
    mode: 'onBlur',
    shouldFocusError: true,
    reValidateMode: 'onBlur',
    resolver: zodResolver(RejectSchema),

    defaultValues: {}
  });

  const onSubmitForm = (data: { comment?: string }) => {
    setIsPending(true);
    onConfirm({ comment: data.comment, status: VerifyProfileStatus.Reject });
  };

  return (
    <form className="w-[450px]" onSubmit={handleSubmit(onSubmitForm)}>
      <div className="flex flex-col gap-[10px] p-6 text-text-default">
        <span className="text-md font-normal">
          Add your comment for rejection
        </span>
        <FormField
          direction={errors.comment?.message}
          id="comment"
          isError={!!errors.comment}
          label="Comment"
          required
        >
          <textarea
            className="bg-background text-neutral-colorText h-32 w-full items-start rounded-xl border p-3 text-sm"
            placeholder="Comment. E.g: what information is missing from the user for verification"
            {...register('comment')}
          />
        </FormField>
      </div>
      <div className="flex items-center justify-between gap-3 border-t px-6 py-4">
        <Button onClick={onCancel} size="lg" variant="outline">
          Cancel
        </Button>
        <Button
          isDisabled={isPending}
          size="lg"
          type="submit"
          variant="primary"
        >
          Send
        </Button>
      </div>
    </form>
  );
}
