import { setGlobalShowToast } from '@/shared/libs/toast-bridge';
import { type VariantProps, cva } from 'class-variance-authority';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';

const ToastContext = createContext<{
  dismissToast: (id?: string) => void;
  showToast: (props: ToastProps) => Promise<void>;
  toastStack: ToastProps[];
}>({
  toastStack: [],
  showToast: async () => {},
  dismissToast: () => {}
});

export function useToastProvider() {
  return useContext(ToastContext);
}

export interface ToastProps extends VariantProps<typeof toastVariants> {
  id?: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  duration?: number;
  ondismissToast?: () => void;
}

export const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-xl border p-4 shadow-lg transition-all',
  {
    variants: {
      variant: {
        default: 'bg-background-default border-input text-text-default',
        success:
          'bg-background-success-subtle border-border-success/20 text-text-default',
        error:
          'bg-background-error-subtle border-border-error/20 text-text-default',
        warning:
          'bg-background-warning-subtle border-border-warning/20 text-text-default',
        info: 'bg-background-info-subtle border-border-info/20 text-text-info'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
);

interface ToastContextProps {
  children: React.ReactNode;
}

export function ToastProvider({ children }: ToastContextProps) {
  const [toastStack, setToastStack] = useState<ToastProps[]>([]);

  const showToast = useCallback(async (props: ToastProps) => {
    const id = props.id || Math.random().toString(36).substring(2, 9);
    const duration = props.duration || 5000;

    setToastStack((prevToasts) => [...prevToasts, { ...props, id }]);

    if (duration > 0) {
      setTimeout(() => {
        dismissToast(id);
      }, duration);
    }
  }, []);

  const dismissToast = useCallback((id?: string) => {
    if (!id) {
      setToastStack((prevToasts) => prevToasts.slice(0, -1));
    } else {
      setToastStack((prevToasts) => prevToasts.filter((t) => t.id !== id));
    }
  }, []);

  // Register for use outside React
  useEffect(() => {
    setGlobalShowToast(showToast);
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ toastStack, showToast, dismissToast }}>
      {children}
    </ToastContext.Provider>
  );
}
