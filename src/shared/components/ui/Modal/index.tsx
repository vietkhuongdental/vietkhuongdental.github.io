/* eslint-disable react/jsx-no-leaked-render */
import Row from '@/shared/components/ui/Row';
// Assets Imports
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
// React Imports
import React, { useCallback, useState } from 'react';

// Shared Imports
import { Button } from '../Button';

interface ModalProps {
  title?: string;
  children: React.ReactNode;
  confirmButtonText?: string;
  cancelButtonText?: string;
  actionButtonText?: string;
  hideButton?: boolean;
  hideCloseIcon?: boolean;
  onConfirm?: () => void;
  onAction?: () => void;
}

const Modal = ({
  title,
  children,
  hideButton,
  hideCloseIcon,
  confirmButtonText,
  cancelButtonText,
  actionButtonText,
  onConfirm,
  onAction
}: ModalProps) => {
  const [open, setOpen] = useState(true);

  const handleCloseDialog = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <Dialog.Root open={open}>
      <Dialog.Overlay className="fixed inset-0 z-[1000] bg-black/50 backdrop-blur-sm" />
      <Dialog.Content className="absolute left-1/2 top-1/2 z-[1500] h-fit w-fit -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-background-default">
        {!hideCloseIcon && (
          <Dialog.Close asChild>
            <button
              className="absolute right-4 top-4"
              onClick={handleCloseDialog}
              type="button"
            >
              <X />
            </button>
          </Dialog.Close>
        )}
        <div className="flex h-fit w-fit flex-col">
          {title && (
            <Dialog.Title className="h-fit border-b px-6 py-4 text-2xl">
              {title}
            </Dialog.Title>
          )}
          {children}
          {!hideButton && (
            <div className="flex justify-end gap-3 border-t px-6 py-4">
              <Row classes="gap-3 justify-between" flex>
                <Button
                  onClick={handleCloseDialog}
                  size="lg"
                  type="button"
                  variant="outline"
                >
                  {cancelButtonText}
                </Button>
                {actionButtonText && (
                  <Button
                    onClick={onAction}
                    size="lg"
                    type="button"
                    variant="danger"
                  >
                    {actionButtonText}
                  </Button>
                )}
                {confirmButtonText && (
                  <Button
                    onClick={onConfirm}
                    size="lg"
                    type="button"
                    variant="primary"
                  >
                    {confirmButtonText}
                  </Button>
                )}
              </Row>
            </div>
          )}
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default Modal;
