/* eslint-disable react-refresh/only-export-components */
// React Imports
import type Modal from '@/shared/components/ui/Modal';
import {
  type ComponentProps,
  type ReactNode,
  createContext,
  useContext,
  useState
} from 'react';

// Shared Imports

interface ModalContextType {
  modalStack: ModalProperties[];
  onShowModal: (optionals: ModalProperties) => Promise<void>;
  onCloseModal: () => Promise<void>;
  onCloseAllModals: () => Promise<void>;
}

type ModalProperties = ComponentProps<typeof Modal>;

const ModalContext = createContext<ModalContextType | undefined>(undefined);

const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [modalStack, setModalStack] = useState<ModalProperties[]>([]);

  const onShowModal = async (modals: ModalProperties): Promise<void> =>
    new Promise((resolve) => {
      setModalStack((previousModals) => [...previousModals, { ...modals }]);
      resolve();
    });

  const onCloseModal = async (): Promise<void> =>
    new Promise((resolve) => {
      setModalStack((previousModals) => previousModals.slice(0, -1));
      resolve();
    });

  const onCloseAllModals = async (): Promise<void> =>
    new Promise((resolve) => {
      setModalStack([]);
      resolve();
    });

  return (
    <ModalContext.Provider
      value={{ modalStack, onShowModal, onCloseModal, onCloseAllModals }}
    >
      {children}
    </ModalContext.Provider>
  );
};

function useModalProvider(): ModalContextType {
  const context = useContext(ModalContext);

  if (context === undefined) {
    throw new Error('useModalProvider must be used within a ModalProvider');
  }

  return context;
}

export { ModalProvider, useModalProvider };
