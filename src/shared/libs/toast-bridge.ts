import type { ToastProps } from '@/shared/hooks';

let showToastGlobal: ((props: ToastProps) => Promise<void>) | null = null;

export function setGlobalShowToast(cb: typeof showToastGlobal) {
  showToastGlobal = cb;
}

export function showToastOutsideReact(props: ToastProps) {
  if (typeof window !== 'undefined' && showToastGlobal) {
    showToastGlobal(props);
  } else {
    // eslint-disable-next-line no-console
    console.warn('showToast is not registered yet or called in SSR.');
  }
}
