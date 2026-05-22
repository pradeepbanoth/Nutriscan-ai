"use client";

import { useEffect, useRef, useState } from "react";

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  onClose: () => void;
}

export default function BarcodeScanner({ onScan, onClose }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState("");
  const [scanning, setScanning] = useState(true);
  const [detected, setDetected] = useState(false);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let animationId: number;
    let stopped = false;

    async function startScanner() {
      try {
        // Request camera access - prefer back camera
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: "environment" },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        // Check if native BarcodeDetector is available
        if ("BarcodeDetector" in window) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const detector = new (window as any).BarcodeDetector({
            formats: [
              "ean_13", "ean_8", "upc_a", "upc_e",
              "code_128", "code_39", "qr_code", "data_matrix"
            ],
          });

          async function detect() {
            if (stopped || !videoRef.current) return;
            try {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const barcodes = await detector.detect(videoRef.current);
              if (barcodes.length > 0 && !stopped) {
                stopped = true;
                setDetected(true);
                setScanning(false);
                setTimeout(() => onScan(barcodes[0].rawValue), 500);
                return;
              }
            } catch {
              // Continue scanning on detection errors
            }
            animationId = requestAnimationFrame(detect);
          }

          // Start detection loop after video is playing
          videoRef.current?.addEventListener("playing", () => {
            detect();
          });

        } else {
          setError(
            "Camera scanning requires Chrome on Android or desktop. Please type the barcode manually instead."
          );
        }
      } catch (e) {
        console.error(e);
        setError("Could not access camera. Please allow camera permissions in your browser settings.");
      }
    }

    startScanner();

    return () => {
      stopped = true;
      cancelAnimationFrame(animationId);
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  }, [onScan]);

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
      <div className="relative w-full max-w-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-white font-bold text-lg">Scan Barcode</h3>
            <p className="text-white/40 text-xs mt-0.5">Point camera at product barcode</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all"
          >
            ✕
          </button>
        </div>

        {/* Camera view */}
        <div className="relative rounded-2xl overflow-hidden bg-black aspect-square shadow-2xl">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            muted
            playsInline
          />

          {/* Overlay */}
          {!error && (
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Dark overlay around scan area */}
              <div className="absolute inset-0 bg-black/30" />

              {/* Scan frame */}
              <div className="relative w-56 h-56 z-10">
                {/* Corners */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-[3px] border-l-[3px] border-[#00ff87] rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-[3px] border-r-[3px] border-[#00ff87] rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-[3px] border-l-[3px] border-[#00ff87] rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-[3px] border-r-[3px] border-[#00ff87] rounded-br-lg" />

                {/* Scanning line */}
                {scanning && !detected && (
                  <div
                    className="absolute left-3 right-3 h-0.5 bg-gradient-to-r from-transparent via-[#00ff87] to-transparent opacity-90 z-20"
                    style={{ animation: "scanline 1.8s ease-in-out infinite", top: "20%" }}
                  />
                )}

                {/* Success checkmark */}
                {detected && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-[#00ff87]/20 flex items-center justify-center border-2 border-[#00ff87]">
                      <span className="text-[#00ff87] text-3xl">✓</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-4 text-center">
            <div className="text-2xl mb-2">📷</div>
            <p className="text-red-400 text-sm leading-relaxed">{error}</p>
          </div>
        )}

        {/* Status */}
        {!error && (
          <div className="mt-4 flex items-center justify-center gap-2">
            {scanning && !detected && (
              <>
                <div className="w-2 h-2 rounded-full bg-[#00ff87] animate-pulse" />
                <p className="text-white/50 text-sm">Scanning for barcode...</p>
              </>
            )}
            {detected && (
              <>
                <div className="w-2 h-2 rounded-full bg-[#00ff87]" />
                <p className="text-[#00ff87] text-sm font-semibold">Barcode detected!</p>
              </>
            )}
          </div>
        )}

        {/* Cancel */}
        <button
          onClick={onClose}
          className="w-full mt-4 py-3.5 border border-white/10 rounded-2xl text-white/40 hover:text-white hover:border-white/20 transition-all text-sm font-medium"
        >
          Cancel
        </button>
      </div>

      <style jsx>{`
        @keyframes scanline {
          0%, 100% { top: 15%; opacity: 1; }
          50% { top: 80%; opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}
