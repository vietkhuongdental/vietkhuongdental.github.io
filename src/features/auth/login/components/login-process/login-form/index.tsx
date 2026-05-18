/* eslint-disable import/no-unresolved */
import type { LoginFormData } from '@/features/auth/login/helpers/schema';
import { loginSchema } from '@/features/auth/login/helpers/schema';
import useLogin from '@/features/auth/login/hooks/api/useLogin';
import type { UserLogin } from '@/features/auth/login/interface';
import { FormField } from '@/shared/components/blocks/FormField';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { useToastProvider } from '@/shared/hooks';
import { ErrorCode } from '@/shared/services/http/configs';
import { useAuthStore } from '@/shared/stores/useAuthStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, Mail } from 'lucide-react';
import { type Dispatch, type SetStateAction, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface Props {
  onSetErrorCode: Dispatch<SetStateAction<number | undefined>>;
  onSetEmail: Dispatch<SetStateAction<string>>;
}

export default function LoginForm({ onSetErrorCode, onSetEmail }: Props) {
  const { pathname } = window.location;
  const isAdmin = useMemo(() => pathname.startsWith('/admin'), [pathname]);

  const location = useLocation();
  const from =
    (location.state as { from?: string })?.from || (isAdmin ? '/admin' : '/');

  const { showToast } = useToastProvider();

  const { authStore } = useAuthStore();

  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors }
  } = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: ''
    },
    mode: 'onBlur',
    shouldFocusError: true,
    reValidateMode: 'onBlur',
    resolver: zodResolver(loginSchema)
  });

  const { onLogin, isPending: isLoading } = useLogin({
    onSuccess: async (response) => {
      const user = {
        id: response?.data?.account.id,
        email: response?.data?.account.userName,
        role: response?.data?.account.role
      };
      authStore.setUser(user);

      const token = {
        accessToken: response?.data?.token.accessToken,
        refreshToken: response?.data?.token.refreshToken
      };

      authStore.login(user, token);

      setTimeout(() => {
        navigate(from, { replace: true });
      }, 100);
    },
    onError: async (error) => {
      const errorData = JSON.parse(error.message);

      if (errorData.code === ErrorCode.ErrorEmailAlreadySoftDeleted) {
        onSetErrorCode(ErrorCode.ErrorEmailAlreadySoftDeleted);
        onSetEmail(getValues('email'));
        // showToast({
        //   variant: 'error',
        //   title: 'Account has been already terminated for deletion'
        // });
        return;
      }

      return showToast({
        variant: 'error',
        title: 'Email or password is incorrect'
      });
    }
  });

  const handleLogin = async (data: LoginFormData) => {
    onLogin({ userName: data.email, password: data.password } as UserLogin);
  };

  return (
    <div className="flex flex-col gap-6">
      <h4 className="font-bold"> {!isAdmin ? 'Sign in' : 'Admin sign in'}</h4>

      <form
        className="flex flex-col gap-6"
        onSubmit={handleSubmit(handleLogin)}
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
              {...register('email')}
            />
          </FormField>

          <FormField
            direction={errors.password?.message}
            id="password"
            isError={!!errors.password}
            label="Password"
          >
            <Input
              id="password"
              leadingIcon={<Lock className="h-5 w-5" />}
              placeholder="Password"
              type="password"
              {...register('password')}
            />
          </FormField>

          <div className="flex items-center justify-end">
            {/* <Checkbox
              id="remember"
              label="Remember me"
              {...register('remember')}
            /> */}
            <a
              className="text-sm font-medium text-link-default hover:underline"
              href="/auth/forgot-password"
            >
              Forgot Password?
            </a>
          </div>
        </div>
        <Button
          className="w-full"
          isDisabled={isLoading}
          size="lg"
          type="submit"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      <div className="border-t border-border-subtle text-center">
        <p className="mt-8 text-sm text-text-description">
          No account yet?
          <Link
            className="ml-1 font-medium text-link-default hover:underline"
            to="/auth/sign-up"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
