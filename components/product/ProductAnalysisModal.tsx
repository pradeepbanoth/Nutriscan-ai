"use client";

import { useEffect } from "react";

type ProductAnalysisModalProps = {
  children: React.ReactNode;
  onClose: () => void;
};

export default function ProductAnalysisModal({
  children,
  onClose,
}: ProductAnalysisModalProps) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-md">
      <button
        type="button"
        aria-label="Close product analysis"
        onMouseDown={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onClose();
        }}
        className="fixed right-4 top-4 z-[10000] flex h-12 w-12 items-center justify-center rounded-full bg-white text-2xl font-black text-orange-600 shadow-sm"
      >
        ×
      </button>

      <div
        onClick={onClose}
        className="flex h-full w-full items-end justify-center sm:items-center"
      >
        <div
          onClick={(event) => event.stopPropagation()}
          className="w-full max-w-5xl overflow-hidden rounded-t-[32px] border border-orange-100 bg-white shadow-2xl sm:max-h-[88vh] sm:rounded-[32px]"
        >
          <div className="border-b border-orange-100 bg-white px-5 py-4">
            <div className="mx-auto h-1.5 w-16 rounded-full bg-gray-300" />

            <p className="mt-4 text-sm font-black uppercase tracking-[0.2em] text-gray-500">
              Product Analysis
            </p>
          </div>

          <div className="h-2 bg-gradient-to-r from-orange-500 to-orange-600" />

          <div className="max-h-[75vh] overflow-y-auto px-4 py-6 sm:px-6 md:px-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}