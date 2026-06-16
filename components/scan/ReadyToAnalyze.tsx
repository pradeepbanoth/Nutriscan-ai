type ReadyToAnalyzeProps = {
  onScan: () => void;
};

export default function ReadyToAnalyze({ onScan }: ReadyToAnalyzeProps) {
  return (
    <div className="mt-10 max-w-2xl mx-auto rounded-[32px] border border-orange-100 bg-orange-50/50 p-8 text-center">
      <h3 className="text-xl font-black text-gray-900 mb-3">
        Ready to analyze your food
      </h3>

      <p className="text-gray-500 mb-6">
        Open the scanner or enter a barcode manually to get instant health insights.
      </p>

      <button
        onClick={onScan}
        className="rounded-[20px] bg-orange-500 px-8 py-4 font-bold text-white shadow-lg hover:bg-orange-600 transition"
      >
        Start Scanning
      </button>
    </div>
  );
}