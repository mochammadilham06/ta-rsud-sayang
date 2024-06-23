import { Dialog, Transition } from '@headlessui/react';
import { FormEvent, Fragment, ReactNode } from 'react';
import Button from '../button';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onLoadingAction?: boolean;
  disableAction?: boolean;
  disableCancel?: boolean;
  title?: string;
  children?: ReactNode;
  className?: string;
  values?: any;
}

export default function Modal({ open, onClose, onConfirm, children, title, className, onLoadingAction, disableAction, disableCancel }: ModalProps) {
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" open={open} onClose={onClose}>
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0" />
        </Transition.Child>
        <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
          <div className="flex min-h-screen items-start justify-center px-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel as="div" className={`panel my-8 w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark ${className}`}>
                <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                  <div className="text-lg font-bold">{title ?? 'Confirm'}</div>
                  <button type="button" className="text-white-dark hover:text-dark" onClick={onClose}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
                <div className="p-5">
                  {children}
                  <div className="mt-8 flex items-center justify-end gap-3">
                    <Button variant="outline-danger" onAction={onClose} disable={disableCancel} title="Discard" />
                    <Button onAction={onConfirm} loading={onLoadingAction} disable={disableAction} />
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
