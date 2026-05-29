"use client";

import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

interface Props {
  onScan: (barcode: string) => void;
}

export default function BarcodeScanner({
  onScan,
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();

    let controls: any;

    async function startScanner() {
      try {
        const devices =
          await BrowserMultiFormatReader.listVideoInputDevices();

        if (!devices.length) {
          alert("No camera found");
          return;
        }

        controls =
          await codeReader.decodeFromVideoDevice(
            devices[0].deviceId,
            videoRef.current!,
            (result, error) => {
              if (result && !scanned) {
                const barcode = result.getText();

                setScanned(true);

                if (navigator.vibrate) {
                  navigator.vibrate(200);
                }

                onScan(barcode);

                controls?.stop();
              }
            }
          );
      } catch (err) {
        console.log(err);
      }
    }

    startScanner();

    return () => {
      controls?.stop();
    };
  }, [onScan, scanned]);

  return (
    <div className="relative w-full">
      {/* Scanner Frame */}
      <div className="relative overflow-hidden rounded-[28px] border border-orange-200 shadow-2xl">
        <video
          ref={videoRef}
          className="w-full h-[420px] object-cover bg-black"
        />

        {/* Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/20" />

          {/* Scan Area */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-[260px] h-[180px] border-2 border-white rounded-3xl shadow-[0_0_30px_rgba(255,255,255,0.5)]">
              {/* Animated Scan Line */}
              {!scanned && (
                <div className="absolute left-0 right-0 top-0 h-1 bg-orange-500 animate-[scan_2s_linear_infinite]" />
              )}

              {/* Success State */}
              {scanned && (
                <div className="absolute inset-0 bg-green-500/20 border-green-400 rounded-3xl animate-pulse" />
              )}
            </div>
          </div>

          {/* Corners */}
          <div className="absolute top-[120px] left-[60px] w-10 h-10 border-l-4 border-t-4 border-white rounded-tl-2xl" />
          <div className="absolute top-[120px] right-[60px] w-10 h-10 border-r-4 border-t-4 border-white rounded-tr-2xl" />
          <div className="absolute bottom-[120px] left-[60px] w-10 h-10 border-l-4 border-b-4 border-white rounded-bl-2xl" />
          <div className="absolute bottom-[120px] right-[60px] w-10 h-10 border-r-4 border-b-4 border-white rounded-br-2xl" />
        </div>
      </div>

      {/* Bottom Text */}
      <div className="mt-5 text-center">
        {!scanned ? (
          <>
            <p className="text-lg font-bold text-orange-600">
              Scanning barcode...
            </p>

            <p className="text-sm text-gray-400 mt-1">
              Align barcode inside frame
            </p>
          </>
        ) : (
          <>
            <p className="text-lg font-bold text-green-600">
              Product detected successfully
            </p>

            <p className="text-sm text-gray-400 mt-1">
              AI analyzing nutrition
            </p>
          </>
        )}
      </div>

      {/* Animation Style */}
      <style jsx>{`
        @keyframes scan {
          0% {
            top: 0%;
          }

          50% {
            top: 95%;
          }

          100% {
            top: 0%;
          }
        }
      `}</style>
    </div>
  );
}