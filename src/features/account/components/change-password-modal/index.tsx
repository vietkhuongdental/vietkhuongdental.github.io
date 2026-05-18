import {
  ChangePasswordFormKey,
  changePasswordFormSchema
} from '@/features/account/components/helper';
import useUpdatePassword from '@/features/account/hooks/useUpdatePassword';
import type { ChangePasswordForm } from '@/features/account/interface';
import { FormField } from '@/shared/components/blocks/FormField';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { useModalProvider, useToastProvider } from '@/shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';

export default function ChangePasswordModal() {
  const { onCloseModal } = useModalProvider();
  const { showToast } = useToastProvider();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ChangePasswordForm>({
    mode: 'onBlur',
    shouldFocusError: true,
    reValidateMode: 'onBlur',
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  const { onUpdatePassword, isPending } = useUpdatePassword({
    onSuccess: () => {
      onCloseModal();
      showToast({
        title: 'Update Password Successfully',
        variant: 'success'
      });
    },
    onError: () => {
      showToast({
        title: 'Incorrect current password',
        variant: 'error'
      });
    }
  });

  const handleClickCancel = useCallback(async () => {
    await onCloseModal();
  }, []);

  const onSubmitForm = async (data: ChangePasswordForm): Promise<void> => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...rest } = data;
    onUpdatePassword({
      ...rest
    });
  };

  return (
    <div className="h-fit max-w-[800px] flex-1 overflow-auto xl:w-[800px]">
      <form
        className="flex h-[calc(80vh-200px)] flex-col"
        onSubmit={handleSubmit(onSubmitForm)}
      >
        <div className="flex h-[calc(100%-81px)] flex-col gap-5 overflow-auto p-6">
          <FormField
            direction={errors.currentPassword?.message}
            id="currentPassword"
            isError={!!errors.currentPassword}
            label="Current Password"
            toolTip="Use at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character."
          >
            <Input
              id="newPassword"
              placeholder="Current Password"
              type="password"
              {...register(ChangePasswordFormKey.CurrentPassword)}
            />
          </FormField>
          <FormField
            direction={errors.newPassword?.message}
            id="newPassword"
            isError={!!errors.newPassword}
            label="New Password"
            toolTip="Use at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character."
          >
            <Input
              id="newPassword"
              placeholder="New Password"
              type="password"
              {...register(ChangePasswordFormKey.NewPassword)}
            />
          </FormField>
          <FormField
            direction={errors.confirmPassword?.message}
            id="confirmPassword"
            isError={!!errors.confirmPassword}
            label="Confirm new password"
            toolTip="Use at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character."
          >
            <Input
              id="confirmPassword"
              placeholder="Confirm new password"
              type="password"
              {...register(ChangePasswordFormKey.ConfirmPassword)}
            />
          </FormField>
        </div>

        <div className="flex justify-between gap-3 border-t px-6 py-4">
          <Button onClick={handleClickCancel} size="lg" variant="outline">
            Cancel
          </Button>
          <Button
            isDisabled={isPending}
            size="lg"
            type="submit"
            variant="primary"
          >
            Save change
          </Button>
        </div>
      </form>
    </div>
  );
}
