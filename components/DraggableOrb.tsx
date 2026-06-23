"use client";

import { useEffect, useState } from "react";

export default function CursorOrb() {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      setPos({
        x: e.clientX,
        y: e.clientY,
      });
    }

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed z-[9999]"
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        transform: "translate(-50%, -50%)",
      }}
    >
      <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-orange-200 bg-white/20 backdrop-blur-xl shadow-[0_0_40px_rgba(249,115,22,0.35)]">

        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-orange-400 to-orange-600" />

        <div className="h-3 w-3 rounded-full bg-white z-10" />

      </div>
    </div>
  );
}