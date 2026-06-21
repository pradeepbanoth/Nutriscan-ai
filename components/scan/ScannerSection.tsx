/* eslint-disable @typescript-eslint/no-explicit-any */

import type React from "react";
import posthog from "posthog-js";
import { AnalyticsEvents } from "@/lib/analyticsEvents";

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
          Open the camera like a payment scanner or enter the barcode manually.
        </p>
      </div>

      <div className="space-y-4">
        <button
          type="button"
         onClick={() => {
  window.location.href = "/scan/camera";
}}

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

  posthog.capture(
    AnalyticsEvents.SCAN_STARTED,
    {
      source: "manual_barcode",

      barcode_length:
        barcode.trim().length,
    }
  );

  fetchProduct();
}}
            className="rounded-2xl bg-gray-900 px-6 py-4 text-sm font-black text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </div>
      </div>

      {scannerOpen && (
        <div className="fixed inset-0 z-[9999] bg-black text-white">
          <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between px-5 py-5">
            <div>
              <p className="text-sm font-black uppercase tracking-wider text-orange-300">
                PAUSTICA Scanner
              </p>
              <p className="text-xs text-white/60">
                Align barcode inside the frame
              </p>
            </div>

            <button
              type="button"
              onClick={() => setScannerOpen(false)}
              className="rounded-full bg-white/10 px-5 py-3 text-sm font-black text-white backdrop-blur transition hover:bg-white/20"
            >
              Close
            </button>
          </div>

          <div className="flex h-full items-center justify-center px-5">
            <div className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-white/10 bg-black">
              
                <BarcodeScanner
  onScan={(code: string) => {
    if (!canRunAction(lastScannerScanRef, 2000))
      return;

    posthog.capture(
      AnalyticsEvents.SCAN_STARTED,
      {
        source: "camera",

        barcode_length:
          code.length,
      }
    );

    setBarcode(code);

    setScannerOpen(false);

    setLoading(true);

    fetchProduct(code);
  }}
/>

              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="h-44 w-[82%] rounded-3xl border-4 border-orange-400 shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]" />
              </div>
            </div>
          </div>

          <div className="absolute bottom-8 left-0 right-0 px-6 text-center">
            <p className="mx-auto max-w-sm rounded-full bg-white/10 px-5 py-3 text-sm font-bold text-white/80 backdrop-blur">
              Hold steady. PAUSTICA will detect the barcode automatically.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}