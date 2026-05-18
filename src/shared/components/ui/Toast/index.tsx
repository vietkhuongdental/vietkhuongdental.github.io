import type { ToastProps } from '@/shared/hooks';
import { toastVariants } from '@/shared/hooks';
import { cn } from '@/shared/libs/utils';
import { X } from 'lucide-react';

interface ToastifyProps {
  context: ToastProps;
  onDismissToast: (id?: string) => void;
}

const Toast = ({ context, onDismissToast }: ToastifyProps) => (
  <div
    className={cn(toastVariants({ variant: context.variant }))}
    key={context.id}
    role="alert"
  >
    <div className="flex flex-row gap-2">
      {/* ICON */}
      {context.variant === 'info' && (
        <svg
          fill="none"
          height="20"
          viewBox="0 0 20 20"
          width="20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_5425_65472)">
            <path
              d="M9.99984 13.3334V10M9.99984 6.66669H10.0082M18.3332 10C18.3332 14.6024 14.6022 18.3334 9.99984 18.3334C5.39746 18.3334 1.6665 14.6024 1.6665 10C1.6665 5.39765 5.39746 1.66669 9.99984 1.66669C14.6022 1.66669 18.3332 5.39765 18.3332 10Z"
              stroke="#002AB3"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </g>
          <defs>
            <clipPath id="clip0_5425_65472">
              <rect fill="white" height="20" width="20" />
            </clipPath>
          </defs>
        </svg>
      )}
      {context.variant === 'success' && (
        <svg
          fill="none"
          height="19"
          viewBox="0 0 19 19"
          width="19"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5.58333 9.33333L8.08333 11.8333L13.0833 6.83333M17.6667 9.33333C17.6667 13.9357 13.9357 17.6667 9.33333 17.6667C4.73096 17.6667 1 13.9357 1 9.33333C1 4.73096 4.73096 1 9.33333 1C13.9357 1 17.6667 4.73096 17.6667 9.33333Z"
            stroke="#17723F"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </svg>
      )}
      {/* CONTENT */}
      <div className="flex flex-col">
        {context.title ? (
          <div className="font-medium text-text-default">{context.title}</div>
        ) : null}
        {context.description ? (
          <div className="text-sm text-text-description">
            {context.description}
          </div>
        ) : null}
      </div>
    </div>
    <div className="absolute right-2 top-2 gap-2">
      {context.action}
      <button
        className="text-muted-foreground focus:ring-ring inline-flex h-6 w-6 items-center justify-center rounded-lg hover:text-text-default focus:outline-none focus:ring-2 focus:ring-offset-2"
        onClick={() => onDismissToast(context.id)}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  </div>
);

export default Toast;
