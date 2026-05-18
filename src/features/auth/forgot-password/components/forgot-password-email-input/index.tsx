import { EmailInputFormKey } from '@/features/auth/forgot-password/helpers/schema';
import useOtpResetEmail from '@/features/auth/forgot-password/hooks/api/use-otp-reset-password';
import type { ForgotPasswordEmailInput } from '@/features/auth/forgot-password/interface';
import type { UserSignUp } from '@/features/auth/sign-up/interface';
import { FormField } from '@/shared/components/blocks/FormField';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { useToastProvider } from '@/shared/hooks';
import { Mail } from 'lucide-react';
import { type Dispatch, type SetStateAction } from 'react';
import { useForm } from 'react-hook-form';

interface OtpRestEmailFormProps {
  setEmail: Dispatch<SetStateAction<string>>;
  setStepForgotPassword: Dispatch<SetStateAction<string>>;
}

export const OtpRestEmailInputForm = ({
  setEmail,
  setStepForgotPassword
}: OtpRestEmailFormProps) => {
  const { showToast } = useToastProvider();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors }
  } = useForm<UserSignUp>({
    mode: 'onBlur',
    shouldFocusError: true,
    reValidateMode: 'onBlur'
  });

  const { onOtpResetEmail } = useOtpResetEmail({
    onSuccess: async () => {
      setEmail(getValues(EmailInputFormKey.Email));
      setStepForgotPassword('2');
      showToast({
        variant: 'success',
        title: 'Send OTP successfully!'
      });
    },
    onError: async () => {
      showToast({
        variant: 'error',
        title: 'Something wrong!'
      });
    }
  });

  const onSubmitForm = async ({
    email
  }: ForgotPasswordEmailInput): Promise<void> => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onOtpResetEmail({
      email
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
            direction={errors.email?.message}
            id="email"
            isError={!!errors.email}
            label="Email address"
          >
            <Input
              id="email"
              leadingIcon={<Mail className="h-5 w-5" />}
              placeholder="Email address"
              type="email"
              {...register('email')}
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
