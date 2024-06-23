import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

export interface ModalConfirmProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  variant: 'success' | 'error';
}
export default function ResponseModal({ open, onClose, title, description, variant }: ModalConfirmProps) {
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" open={open} onClose={onClose}>
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0" />
        </Transition.Child>
        <div id="standard_modal" className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
          <div className="flex min-h-screen items-center justify-center px-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="panel my-8 w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                <div className="flex items-center justify-center p-5 text-base font-medium text-[#1f2937] dark:text-white-dark/70">
                  {variant === 'error' && (
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-danger-light dark:bg-white/10">
                      <svg width={60} height={60} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M8.96967 8.96967C9.26256 8.67678 9.73744 8.67678 10.0303 8.96967L12 10.9394L13.9697 8.96969C14.2626 8.6768 14.7374 8.6768 15.0303 8.96969C15.3232 9.26258 15.3232 9.73746 15.0303 10.0303L13.0607 12L15.0303 13.9697C15.3232 14.2625 15.3232 14.7374 15.0303 15.0303C14.7374 15.3232 14.2625 15.3232 13.9696 15.0303L12 13.0607L10.0304 15.0303C9.73746 15.3232 9.26258 15.3232 8.96969 15.0303C8.6768 14.7374 8.6768 14.2626 8.96969 13.9697L10.9394 12L8.96967 10.0303C8.67678 9.73744 8.67678 9.26256 8.96967 8.96967Z"
                          fill="#E7515A"
                        />
                      </svg>
                    </span>
                  )}
                  {variant === 'success' && (
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-success-light dark:bg-white/10">
                      <svg width={60} height={60} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M16.0303 8.96967C16.3232 9.26256 16.3232 9.73744 16.0303 10.0303L11.0303 15.0303C10.7374 15.3232 10.2626 15.3232 9.96967 15.0303L7.96967 13.0303C7.67678 12.7374 7.67678 12.2626 7.96967 11.9697C8.26256 11.6768 8.73744 11.6768 9.03033 11.9697L10.5 13.4393L14.9697 8.96967C15.2626 8.67678 15.7374 8.67678 16.0303 8.96967Z"
                          fill="#00AB55"
                        />
                      </svg>
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <div className="space-y-3 text-center text-sm text-white-dark">
                    <h2 className="text-xl font-bold text-black">{title ?? 'Action Complete'}</h2>
                    <p>{description}</p>
                  </div>
                  <div className="my-8 px-5">
                    <button type="button" onClick={onClose} className="btn btn-primary w-full">
                      Close
                    </button>
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
