/* eslint-disable @typescript-eslint/no-explicit-any */

import type React from "react";

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
    <section className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
      <div className="mb-8">
        <p className="text-sm font-black uppercase tracking-wider text-orange-600">
          Barcode scanner
        </p>

        <h2 className="mt-3 text-3xl font-black text-gray-900">
          Scan packaged food
        </h2>

        <p className="mt-3 text-gray-500">
          Use your camera or enter the barcode manually to analyze nutrition,
          ingredients and processing level.
        </p>
      </div>

      <div className="space-y-4">
        <button
          type="button"
          onClick={() => setScannerOpen(true)}
          className="w-full rounded-2xl bg-orange-500 px-6 py-4 text-base font-black text-white transition hover:bg-orange-600 disabled:opacity-50"
          disabled={loading}
        >
          Open Camera Scanner
        </button>

        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <input
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            placeholder="Enter barcode manually"
            inputMode="numeric"
            className="w-full rounded-2xl border border-gray-100 bg-orange-50/50 px-5 py-4 font-bold text-gray-900 outline-none transition focus:border-orange-300 focus:bg-white"
          />

          <button
            type="button"
            disabled={loading || !barcode.trim()}
            onClick={() => {
              if (!canRunAction(lastBarcodeClickRef, 1500)) return;
              fetchProduct();
            }}
            className="rounded-2xl bg-gray-900 px-6 py-4 text-sm font-black text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </div>
      </div>

      {scannerOpen && (
        <div className="mt-8 rounded-3xl border border-gray-100 bg-gray-950 p-4 shadow-sm">
          <BarcodeScanner
            onScan={(code: string) => {
              if (!canRunAction(lastScannerScanRef, 2000)) return;

              setBarcode(code);
              setScannerOpen(false);
              setLoading(true);
              fetchProduct(code);
            }}
          />

          <div className="mt-4 flex items-center justify-between gap-4">
            <p className="text-sm font-bold text-gray-400">
              Align the barcode inside the frame.
            </p>

            <button
              type="button"
              onClick={() => setScannerOpen(false)}
              className="rounded-full bg-white/10 px-4 py-2 text-sm font-black text-white transition hover:bg-white/20"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
}