import { useState } from 'react';

export const useModal = <T = any>(
  initialProps?: Omit<T, 'open' | 'onClose' | 'onConfirm' | 'children'> & { open?: boolean }
): [{ open: boolean; onClose: () => void; onConfirm: () => void } & T, (props?: Partial<T>) => void, () => void, () => void] => {
  const [modalState, setModalState] = useState<T | any>({
    open: false,
    ...initialProps,
  });

  const hide = () => {
    setModalState((prev: any) => ({ ...prev, open: false }));
  };

  const show = (props: Partial<T> | any = {}) => {
    setModalState((prev: any) => ({ ...prev, ...props, open: true }));
  };

  const confirm = () => {
    if (modalState.onConfirm) {
      modalState.onConfirm();
    }
    hide();
  };

  return [
    {
      ...modalState,
      onClose: hide,
      onConfirm: confirm,
    },
    show,
    hide,
    confirm,
  ];
};
