"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  onClose: () => void;
}

export default function BarcodeScanner({ onScan, onClose }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState("");
  const [scanning, setScanning] = useState(true);
  const [detected, setDetected] = useState(false);
  const [detectedCode, setDetectedCode] = useState("");
  const stoppedRef = useRef(false);

  const handleDetected = useCallback((code: string) => {
    if (stoppedRef.current) return;
    stoppedRef.current = true;
    setDetected(true);
    setScanning(false);
    setDetectedCode(code);
    // Give visual feedback then trigger scan
    setTimeout(() => {
      onScan(code);
    }, 800);
  }, [onScan]);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let animationId: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let detector: any = null;

    async function startScanner() {
      try {
        // Request camera
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: "environment" },
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
        });

        if (!videoRef.current) return;
        videoRef.current.srcObject = stream;
        await videoRef.current.play();

        // Check BarcodeDetector support
        if (!("BarcodeDetector" in window)) {
          setError("Your browser doesn't support camera scanning. Please type the barcode manually.");
          return;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        detector = new (window as any).BarcodeDetector({
          formats: [
            "ean_13", "ean_8", "upc_a", "upc_e",
            "code_128", "code_39", "code_93",
            "qr_code", "data_matrix", "itf"
          ],
        });

        async function detect() {
          if (stoppedRef.current) return;
          if (!videoRef.current || videoRef.current.readyState < 2) {
            animationId = requestAnimationFrame(detect);
            return;
          }

          try {
            const barcodes = await detector.detect(videoRef.current);
            if (barcodes && barcodes.length > 0) {
              const code = barcodes[0].rawValue;
              if (code && code.length > 3) {
                handleDetected(code);
                return;
              }
            }
          } catch {
            // Continue on detection errors
          }

          if (!stoppedRef.current) {
            animationId = requestAnimationFrame(detect);
          }
        }

        // Start detecting after video plays
        videoRef.current.addEventListener("playing", () => {
          setTimeout(detect, 500);
        }, { once: true });

      } catch (e) {
        console.error(e);
        setError("Could not access camera. Please allow camera permissions and try again.");
      }
    }

    startScanner();

    return () => {
      stoppedRef.current = true;
      cancelAnimationFrame(animationId);
      if (stream) stream.getTracks().forEach(t => t.stop());
    };
  }, [handleDetected]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center" style={{ background: "rgba(0,0,0,0.95)" }}>
      <div className="w-full max-w-sm mb-0 md:mb-0">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div>
            <h3 className="text-white font-black text-lg">Scan Barcode</h3>
            <p className="text-white/40 text-xs mt-0.5">Hold steady — point at barcode</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-all" style={{ background: "rgba(255,255,255,0.1)" }}>
            ✕
          </button>
        </div>

        {/* Camera */}
        <div className="relative mx-4 rounded-3xl overflow-hidden" style={{ aspectRatio: "1/1", background: "#111" }}>
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay muted playsInline
          />
          <canvas ref={canvasRef} className="hidden" />

          {/* Scan overlay */}
          {!error && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.3)" }} />
              {/* Scan window */}
              <div className="relative z-10" style={{ width: "65%", aspectRatio: "3/2" }}>
                {/* Clear scan area */}
                <div className="absolute inset-0 rounded-xl" style={{ boxShadow: "0 0 0 1000px rgba(0,0,0,0.5)", border: "2px solid rgba(249,115,22,0.8)" }} />

                {/* Corner markers */}
                <div className="absolute top-0 left-0 w-6 h-6 border-t-3 border-l-3 rounded-tl-xl" style={{ borderColor: "#f97316", borderWidth: "3px", borderRight: "none", borderBottom: "none" }} />
                <div className="absolute top-0 right-0 w-6 h-6 border-t-3 border-r-3 rounded-tr-xl" style={{ borderColor: "#f97316", borderWidth: "3px", borderLeft: "none", borderBottom: "none" }} />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-3 border-l-3 rounded-bl-xl" style={{ borderColor: "#f97316", borderWidth: "3px", borderRight: "none", borderTop: "none" }} />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-3 border-r-3 rounded-br-xl" style={{ borderColor: "#f97316", borderWidth: "3px", borderLeft: "none", borderTop: "none" }} />

                {/* Scanning line */}
                {scanning && !detected && (
                  <div className="absolute left-2 right-2 h-0.5 rounded-full" style={{
                    background: "linear-gradient(90deg, transparent, #f97316, transparent)",
                    animation: "scanline 1.5s ease-in-out infinite",
                    top: "50%"
                  }} />
                )}

                {/* Success */}
                {detected && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-xl" style={{ background: "rgba(249,115,22,0.2)" }}>
                    <div className="text-center">
                      <div className="text-4xl mb-1">✓</div>
                      <div className="text-xs font-bold" style={{ color: "#f97316" }}>{detectedCode}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mx-4 mt-3 rounded-2xl p-4 text-center" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}>
            <div className="text-2xl mb-2">📷</div>
            <p className="text-red-400 text-sm leading-relaxed">{error}</p>
          </div>
        )}

        {/* Status */}
        {!error && (
          <div className="flex items-center justify-center gap-2 mt-3">
            {scanning && !detected && (
              <>
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#f97316" }} />
                <p className="text-white/50 text-sm">Scanning for barcode...</p>
              </>
            )}
            {detected && (
              <>
                <div className="w-2 h-2 rounded-full" style={{ background: "#f97316" }} />
                <p className="text-sm font-semibold" style={{ color: "#f97316" }}>Barcode detected! Analyzing...</p>
              </>
            )}
          </div>
        )}

        {/* Tips */}
        {scanning && !detected && !error && (
          <div className="mx-4 mt-3 rounded-2xl p-3" style={{ background: "rgba(255,255,255,0.05)" }}>
            <p className="text-white/30 text-xs text-center">💡 Hold the barcode inside the orange frame • Ensure good lighting • Keep steady</p>
          </div>
        )}

        {/* Cancel */}
        <button onClick={onClose} className="w-full mt-3 mb-5 mx-0 py-4 text-white/40 hover:text-white text-sm font-medium transition-all">
          Cancel
        </button>
      </div>

      <style jsx>{`
        @keyframes scanline {
          0%, 100% { top: 15%; }
          50% { top: 80%; }
        }
      `}</style>
    </div>
  );
}
