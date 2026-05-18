import { ForgotPasswordNewPasswordInputSchema } from '@/features/auth/forgot-password/helpers/schema';
import useResetEmail from '@/features/auth/forgot-password/hooks/api/use-reset-password';
import type { ForgotPasswordNewPasswordInput } from '@/features/auth/forgot-password/interface';
import { FormField } from '@/shared/components/blocks/FormField';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { useToastProvider } from '@/shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

interface ForgotPasswordFormProps {
  email: string;
  resetPasswordToken: string;
}

export const ForgotPasswordInputForm = ({
  email,
  resetPasswordToken
}: ForgotPasswordFormProps) => {
  const navigate = useNavigate();
  const { showToast } = useToastProvider();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ForgotPasswordNewPasswordInput>({
    mode: 'onBlur',
    shouldFocusError: true,
    reValidateMode: 'onBlur',
    resolver: zodResolver(ForgotPasswordNewPasswordInputSchema)
  });

  const { onResetEmail } = useResetEmail({
    onSuccess: async () => {
      showToast({
        variant: 'success',
        title: 'Reset Password successfully!'
      });

      navigate('/auth/login');
    },
    onError: async (error) => {
      const errorData = JSON.parse(error.message);

      showToast({
        variant: errorData,
        title: 'Reset password unsuccessfully!'
      });
    }
  });

  const onSubmitForm = async ({
    newPassword
  }: ForgotPasswordNewPasswordInput): Promise<void> => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onResetEmail({
      email,
      newPassword,
      resetPasswordToken
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <form
        className="flex flex-col gap-6"
        onSubmit={handleSubmit(onSubmitForm)}
      >
        <div className="flex flex-col gap-3">
          <FormField
            direction={errors.newPassword?.message}
            id="password"
            isError={!!errors.newPassword}
            label="Password"
            toolTip="Use at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character."
          >
            <Input
              id="password"
              leadingIcon={<Lock className="h-5 w-5" />}
              placeholder="Password"
              type="password"
              {...register('newPassword')}
            />
          </FormField>
          <FormField
            direction={errors.confirmNewPassword?.message}
            id="confirmPassword"
            isError={!!errors.confirmNewPassword}
            label="Confirm Password"
            toolTip="Use at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character."
          >
            <Input
              id="confirmPassword"
              leadingIcon={<Lock className="h-5 w-5" />}
              placeholder="Password"
              type="password"
              {...register('confirmNewPassword')}
            />
          </FormField>
        </div>

        <Button className="w-full" size="lg" type="submit">
          {'Continue'}
        </Button>
      </form>
    </div>
  );
};
