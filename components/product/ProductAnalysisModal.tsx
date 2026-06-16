type ProductAnalysisModalProps = {
  children: React.ReactNode;
  onClose: () => void;
};

export default function ProductAnalysisModal({
  children,
  onClose,
}: ProductAnalysisModalProps) {
  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 z-30 bg-black/40 backdrop-blur-md"
      />

      <div className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-5xl rounded-t-[40px] border border-orange-100 bg-white shadow-2xl max-h-[90vh] overflow-y-auto pb-6 sm:bottom-6 sm:rounded-[40px]">
        <div className="sticky top-0 z-20 border-b border-orange-100 bg-white/90 backdrop-blur-xl px-5 py-4">
          <div className="mx-auto mb-4 h-1.5 w-16 rounded-full bg-gray-300" />

          <div className="flex items-center justify-between">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-gray-500">
              Product Analysis
            </p>

            <button
              onClick={onClose}
              className="h-10 w-10 rounded-full border border-orange-100 bg-orange-50 text-xl font-black text-orange-600"
            >
              ×
            </button>
          </div>
        </div>

        <div className="h-2 bg-gradient-to-r from-orange-500 to-orange-600" />

        <div className="p-4 sm:p-6 md:p-8">{children}</div>
      </div>
    </>
  );
}