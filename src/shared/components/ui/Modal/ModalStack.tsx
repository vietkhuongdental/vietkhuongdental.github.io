// Shared Imports

import { useModalProvider } from '@/shared/hooks';

import Modal from '.';

const ModalStack = () => {
  const { modalStack } = useModalProvider();
  return (
    <>
      {modalStack.map((modal, index) => (
        <Modal
          actionButtonText={modal.actionButtonText}
          cancelButtonText={modal.cancelButtonText}
          confirmButtonText={modal.confirmButtonText}
          hideButton={modal.hideButton}
          hideCloseIcon={modal.hideCloseIcon}
          key={index}
          onAction={modal.onAction}
          onConfirm={modal.onConfirm}
          title={modal.title}
        >
          {modal.children}
        </Modal>
      ))}
    </>
  );
};

export default ModalStack;
