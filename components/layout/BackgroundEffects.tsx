"use client";

export default function BackgroundEffects() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">

      <div
        className="bubble-float absolute top-24 left-16 h-96 w-96 rounded-full bg-orange-300/10 blur-[120px]"
      />

      <div
        className="bubble-float absolute top-[40%] right-0 h-[500px] w-[500px] rounded-full bg-orange-400/15 blur-[140px]"
        style={{ animationDelay: "3s" }}
      />

      <div
        className="bubble-float absolute bottom-0 left-1/3 h-[450px] w-[450px] rounded-full bg-yellow-300/15 blur-[140px]"
        style={{ animationDelay: "6s" }}
      />

    </div>
  );
}