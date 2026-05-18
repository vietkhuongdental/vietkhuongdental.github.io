import { UserIcon } from '@/assets/icons/user-icon';
import { RoleType, RoleTypeMap } from '@/constants';
import {
  SignUpFormKey,
  initialValue,
  signUpSchema
} from '@/features/auth/sign-up/helpers/schema';
import useSignup from '@/features/auth/sign-up/hooks/api/use-sign-up';
import type { UserSignUp } from '@/features/auth/sign-up/interface';
import { FormField } from '@/shared/components/blocks/FormField';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { useToastProvider } from '@/shared/hooks';
import { ErrorCode } from '@/shared/services/http/configs';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, Mail } from 'lucide-react';
import { type Dispatch, type SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

interface SignUpFormProps {
  role: RoleType;
  setIsDoneRegisterStep: Dispatch<SetStateAction<boolean>>;
  setEmail: Dispatch<SetStateAction<string>>;
}

export const SignUpInformationForm = ({
  role,
  setIsDoneRegisterStep,
  setEmail
}: SignUpFormProps) => {
  const { showToast } = useToastProvider();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors }
  } = useForm<UserSignUp>({
    defaultValues: initialValue,
    mode: 'onBlur',
    shouldFocusError: true,
    reValidateMode: 'onBlur',
    resolver: zodResolver(signUpSchema)
  });

  const { onSignup, isLoading } = useSignup({
    onSuccess: async () => {
      showToast({
        variant: 'success',
        title: 'Signup successfully!'
      });
      setIsDoneRegisterStep(true);
      setEmail(getValues(SignUpFormKey.Email));
    },
    onError: async (error) => {
      const errorData = JSON.parse(error.message);

      if (errorData.code === ErrorCode.ErrorEmailAlreadyInUse) {
        showToast({
          variant: 'error',
          title: errorData.message
        });
        return;
      }

      showToast({
        variant: 'error',
        title: 'Signup unsuccessfully!'
      });
    }
  });

  const onSubmitForm = async (data: UserSignUp): Promise<void> => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ageConfirm, agreePolicyConfirm, ...rest } = data;
    onSignup({
      ...rest,
      role
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <h4 className="font-bold">
        Sign Up as{' '}
        {role === RoleType.EXPERT ? RoleTypeMap[role] : 'General user'}
      </h4>

      <form
        className="flex flex-col gap-6"
        onSubmit={handleSubmit(onSubmitForm)}
      >
        <div className="flex flex-col gap-3">
          <FormField
            direction={errors.fullName?.message}
            id="fullName"
            isError={!!errors.fullName}
            label="Full Name"
          >
            <Input
              id="fullName"
              leadingIcon={<UserIcon />}
              placeholder="Full name"
              type="fullName"
              {...register('fullName')}
            />
          </FormField>
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
          <FormField
            direction={errors.password?.message}
            id="password"
            isError={!!errors.password}
            label="Password"
            toolTip="Use at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character."
          >
            <Input
              id="password"
              leadingIcon={<Lock className="h-5 w-5" />}
              placeholder="Password"
              type="password"
              {...register('password')}
            />
          </FormField>
          <FormField
            direction={errors.confirmPassword?.message}
            id="confirmPassword"
            isError={!!errors.confirmPassword}
            label="Confirm Password"
            toolTip="Use at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character."
          >
            <Input
              id="confirmPassword"
              leadingIcon={<Lock className="h-5 w-5" />}
              placeholder="Password"
              type="password"
              {...register('confirmPassword')}
            />
          </FormField>
        </div>

        <FormField
          direction={errors.ageConfirm?.message}
          id="ageConfirm"
          isError={!!errors.ageConfirm}
        >
          <div className="flex items-start gap-2">
            <Checkbox className="mt-1" id="terms" {...register('ageConfirm')} />
            <label
              className="text-md text-text-description"
              htmlFor="condition"
            >
              I confirm that I am 18 years old or older
            </label>
          </div>
        </FormField>
        <FormField
          direction={errors.agreePolicyConfirm?.message}
          id="agreePolicyConfirm"
          isError={!!errors.agreePolicyConfirm}
        >
          <div className="flex items-start gap-2">
            <Checkbox
              className="mt-1"
              id="terms"
              {...register('agreePolicyConfirm')}
            />
            <p className="whitespace-nowrap text-md text-text-description">
              I have read and agree to Genorare's
              <a
                className="mx-1 font-medium text-link-default hover:underline"
                href="/public/policy"
              >
                Privacy Policy
              </a>
              and
              <a
                className="ml-1 font-medium text-link-default hover:underline"
                href="/public/terms"
              >
                Terms of Use
              </a>
              .
            </p>
          </div>
        </FormField>

        <Button
          className="w-full"
          isDisabled={isLoading}
          size="lg"
          type="submit"
        >
          {isLoading ? 'Creating account...' : 'Sign Up'}
        </Button>
      </form>

      <div className="border-t border-border-subtle text-center">
        <p className="mt-8 text-sm text-text-description">
          Already have an account?
          <Link
            className="ml-1 font-medium text-link-default hover:underline"
            to="/auth/login"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
