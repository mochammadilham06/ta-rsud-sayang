import React from 'react';

export default function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-[999999999] flex items-center justify-center bg-black bg-opacity-50">
      <span className="inline-block h-14 w-14 animate-spin rounded-full border-8 border-[#f1f2f3] border-l-primary"></span>
    </div>
  );
}
