"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const BarcodeScanner = dynamic(
  () => import("@/components/BarcodeScanner"),
  { ssr: false }
);

export default function CameraScannerPage() {
  const router = useRouter();

  return (
    <main className="fixed inset-0 z-[9999] bg-black text-white">
      <div className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-5 py-5">
        <button
          onClick={() => router.push("/scan")}
          className="rounded-full bg-white/10 px-5 py-3 text-sm font-black backdrop-blur"
        >
          ← Close
        </button>

        <p className="text-sm font-black uppercase tracking-wider text-orange-300">
          PAUSTICA Scanner
        </p>
      </div>

      <div className="flex h-screen items-center justify-center px-4">
        <div className="relative h-[88vh] w-full max-w-md overflow-hidden rounded-[36px] border border-white/10 bg-black">
          <BarcodeScanner
            onScan={(code: string) => {
             localStorage.setItem("paustica_scanned_barcode", code);

router.push("/scan");

            }}
          />

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="h-28 w-[82%] rounded-3xl border-4 border-orange-500 shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-0 right-0 px-6 text-center">
        <p className="mx-auto max-w-sm rounded-full bg-white/10 px-5 py-3 text-sm font-bold text-white/80 backdrop-blur">
          Align barcode inside the frame
        </p>
      </div>
    </main>
  );
}