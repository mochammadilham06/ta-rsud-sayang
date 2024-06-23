import React from 'react';

interface ButtonProps {
  onAction: () => void;
  title?: string;
  loading?: boolean;
  disable?: boolean;
  variant?: 'info' | 'danger' | 'primary' | 'outline-danger';
  size?: 'sm' | 'md' | 'lg';
}
export default function Button({ onAction, title, loading, disable = false, variant = 'info', size = 'md' }: ButtonProps) {
  return (
    <div>
      <button type="button" className={`btn btn-${variant} btn-${size}`} onClick={onAction} disabled={disable}>
        {loading && (
          <>
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="inline-block h-5 w-5 animate-[spin_2s_linear_infinite] align-middle ltr:mr-2 rtl:ml-2"
            >
              <line x1="12" y1="2" x2="12" y2="6"></line>
              <line x1="12" y1="18" x2="12" y2="22"></line>
              <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
              <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
              <line x1="2" y1="12" x2="6" y2="12"></line>
              <line x1="18" y1="12" x2="22" y2="12"></line>
              <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
              <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
            </svg>
            <span>Loading</span>
          </>
        )}
        {!loading && !title ? 'Confirm' : title}
      </button>
    </div>
  );
}
