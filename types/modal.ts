import '@headlessui/react';
import { ReactNode } from 'react';

export interface ModalProps {
  children?: ReactNode;
  className?: string;
  customClassName?: boolean;
  onClose: () => void;
  open: boolean;
  title?: string;
}
