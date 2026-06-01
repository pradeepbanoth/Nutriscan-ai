"use client";

import { useEffect, useRef, useState } from "react";
import {
  BrowserMultiFormatReader,
  IScannerControls,
} from "@zxing/browser";

import {
  DecodeHintType,
  BarcodeFormat,
} from "@zxing/library";

interface Props {
  onScan: (barcode: string) => void;
}

export default function BarcodeScanner({ onScan }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const scannedRef = useRef(false);

  const [scanned, setScanned] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [torchSupported, setTorchSupported] = useState(false);
  const [torchOn, setTorchOn] = useState(false);

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
        setScanned(false);

        if (!navigator.mediaDevices?.getUserMedia) {
          setCameraError("Camera is not supported on this browser.");
          return;
        }

        const controls = await codeReader.decodeFromConstraints(
          {
            video: {
              facingMode: { ideal: "environment" },
              width: { ideal: 1920 },
              height: { ideal: 1080 },
              focusMode: "continuous",
            } as MediaTrackConstraints,
            audio: false,
          },
          videoRef.current!,
          (result) => {
            if (result && !scannedRef.current) {
              scannedRef.current = true;

              const barcode = result.getText();
              setScanned(true);

              if (navigator.vibrate) {
                navigator.vibrate(200);
              }

              onScan(barcode);
              controlsRef.current?.stop();
            }
          }
        );

        controlsRef.current = controls;

        const videoTrack = videoRef.current?.srcObject
          ? (videoRef.current.srcObject as MediaStream).getVideoTracks()[0]
          : null;

        const capabilities = videoTrack?.getCapabilities?.();

        if (capabilities && "torch" in capabilities) {
          setTorchSupported(true);
        }
      } catch (error) {
        console.error(error);

        setCameraError(
          "Unable to open back camera. Please allow camera permission and try again."
        );
      }
    };

    startScanner();

    return () => {
      controlsRef.current?.stop();
      controlsRef.current = null;
    };
  }, [onScan]);

  const toggleTorch = async () => {
    const stream = videoRef.current?.srcObject as MediaStream | null;
    const track = stream?.getVideoTracks()[0];

    if (!track) return;

    try {
      await track.applyConstraints({
        advanced: [{ torch: !torchOn } as MediaTrackConstraintSet],
      });

      setTorchOn(!torchOn);
    } catch (error) {
      console.error(error);
      alert("Torch is not supported on this device.");
    }
  };

  return (
    <div className="relative w-full">
      <div className="relative overflow-hidden rounded-[28px] border border-orange-200 shadow-2xl bg-black">
        <video
          ref={videoRef}
          className="w-full h-[420px] object-cover bg-black"
          muted
          playsInline
          autoPlay
        />

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-black/20" />

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-[280px] h-[190px] border-2 border-white rounded-3xl shadow-[0_0_30px_rgba(255,255,255,0.5)]">
              {!scanned && (
                <div className="absolute left-0 right-0 top-0 h-1 bg-orange-500 animate-[scan_1s_linear_infinite]" />
              )}

              {scanned && (
                <div className="absolute inset-0 bg-green-500/20 border-green-400 rounded-3xl animate-pulse" />
              )}
            </div>
          </div>
        </div>

        {torchSupported && !scanned && (
          <button
            onClick={toggleTorch}
            className="absolute bottom-5 right-5 z-20 rounded-full px-5 py-3 bg-white text-orange-600 font-bold shadow-lg"
          >
            {torchOn ? "Torch Off" : "Torch On"}
          </button>
        )}
      </div>

      <div className="mt-5 text-center">
        {cameraError ? (
          <p className="text-sm font-bold text-red-500">{cameraError}</p>
        ) : !scanned ? (
          <>
            <p className="text-lg font-bold text-orange-600">
              Scanning barcode...
            </p>

            <p className="text-sm text-gray-400 mt-1">
              Use the back camera and align barcode inside frame
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