

/* eslint-disable @typescript-eslint/no-explicit-any */

type ScannerSectionProps = {
  barcode: string;
  setBarcode: (value: string) => void;
  loading: boolean;
  fetchProduct: (code?: string) => void;
  scannerOpen: boolean;
  setScannerOpen: (value: boolean) => void;
  BarcodeScanner: any;
  canRunAction: (
    ref: React.MutableRefObject<number>,
    delay: number
  ) => boolean;
  lastBarcodeClickRef: React.MutableRefObject<number>;
  lastScannerScanRef: React.MutableRefObject<number>;
  setLoading: (value: boolean) => void;
};

export default function ScannerSection({
  barcode,
  setBarcode,
  loading,
  fetchProduct,
  scannerOpen,
  setScannerOpen,
  BarcodeScanner,
  canRunAction,
  lastBarcodeClickRef,
  lastScannerScanRef,
  setLoading,
}: ScannerSectionProps) {
  return (
    <>
      <div className="flex flex-col md:flex-row gap-3 justify-center mb-8">

        <button
          onClick={() => setScannerOpen(true)}
          className="px-8 py-5 rounded-[20px] text-white font-bold text-lg shadow-xl bg-orange-500 hover:bg-orange-600 transition"
        >
          Scan Food
        </button>

        <input
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          placeholder="Enter barcode manually"
          className="px-6 py-5 rounded-2xl bg-white text-gray-900 font-bold outline-none shadow-sm"
        />

        <button
          disabled={loading}
          onClick={() => {
            if (!canRunAction(lastBarcodeClickRef, 1500)) return;
            fetchProduct();
          }}
          className="px-7 py-5 rounded-2xl bg-gray-900 text-white font-bold disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Analyze Barcode"}
        </button>

      </div>

      {scannerOpen && (
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-[32px] shadow-xl mb-10">

          <BarcodeScanner
            onScan={(code: string) => {
              if (!canRunAction(lastScannerScanRef, 2000)) return;

              setBarcode(code);
              setScannerOpen(false);
             setLoading(true);

fetchProduct(code);
            }}
          />

          <p className="mt-4 text-sm text-gray-400">
            Align barcode inside frame
          </p>

        </div>
      )}
    </>
  );
}