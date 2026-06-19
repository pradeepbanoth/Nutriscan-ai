"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader, IScannerControls } from "@zxing/browser";
import { BarcodeFormat, DecodeHintType } from "@zxing/library";

interface Props {
  onScan: (barcode: string) => void;
}

export default function BarcodeScanner({ onScan }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const controlsRef = useRef<IScannerControls | null>(null);

  const scannedRef = useRef(false);
  const lastBarcodeRef = useRef("");
  const lastScanTimeRef = useRef(0);

  const [cameraError, setCameraError] = useState("");

  const handleDetectedBarcode = useCallback(
    (barcode: string) => {
      const cleanBarcode = barcode.trim();
      const now = Date.now();

      if (!cleanBarcode) return;
      if (scannedRef.current) return;
      if (cleanBarcode === lastBarcodeRef.current) return;
      if (now - lastScanTimeRef.current < 1500) return;

      scannedRef.current = true;
      lastBarcodeRef.current = cleanBarcode;
      lastScanTimeRef.current = now;

      if (navigator.vibrate) {
        navigator.vibrate(120);
      }

      controlsRef.current?.stop();
      onScan(cleanBarcode);
    },
    [onScan]
  );

  useEffect(() => {
    const hints = new Map();

    hints.set(DecodeHintType.POSSIBLE_FORMATS, [
      BarcodeFormat.EAN_13,
      BarcodeFormat.EAN_8,
      BarcodeFormat.UPC_A,
      BarcodeFormat.UPC_E,
      BarcodeFormat.CODE_128,
    ]);

    hints.set(DecodeHintType.TRY_HARDER, true);

    const codeReader = new BrowserMultiFormatReader(hints);

    const startScanner = async () => {
      try {
        setCameraError("");
        scannedRef.current = false;
        lastBarcodeRef.current = "";
        lastScanTimeRef.current = 0;

        if (!navigator.mediaDevices?.getUserMedia) {
          setCameraError("Camera is not supported on this browser.");
          return;
        }

        const controls = await codeReader.decodeFromConstraints(
          {
            video: {
              facingMode: { ideal: "environment" },
              width: { ideal: 1280 },
              height: { ideal: 720 },
              frameRate: { ideal: 24 },
            },
            audio: false,
          },
          videoRef.current!,
          (result) => {
            if (result) {
              handleDetectedBarcode(result.getText());
            }
          }
        );

        controlsRef.current = controls;
      } catch (error) {
        console.error(error);

        setCameraError(
          "Unable to access camera. Please allow camera permission and try again."
        );
      }
    };

    startScanner();

    return () => {
      controlsRef.current?.stop();
      controlsRef.current = null;
    };
  }, [handleDetectedBarcode]);

  return (
    <div className="relative h-full w-full bg-black">
      <video
        ref={videoRef}
        className="h-full w-full bg-black object-cover"
        muted
        playsInline
        autoPlay
      />

      {cameraError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black px-6 text-center">
          <p className="text-sm font-bold text-red-400">{cameraError}</p>
        </div>
      )}
    </div>
  );
}