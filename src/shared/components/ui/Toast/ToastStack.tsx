import Toast from '@/shared/components/ui/Toast/index';
import { useToastProvider } from '@/shared/hooks';

const ToastStack = () => {
  const { toastStack, dismissToast } = useToastProvider();

  if (!toastStack.length) return null;

  return (
    <div className="fixed right-0 top-0 z-[2000] flex w-full max-w-sm flex-col gap-2 p-4">
      <Toast
        context={toastStack[toastStack.length - 1]}
        onDismissToast={dismissToast}
      />
    </div>
  );
};

export default ToastStack;
