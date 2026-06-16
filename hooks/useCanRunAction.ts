"use client";

export function useCanRunAction() {
  const canRunAction = (
    ref: React.MutableRefObject<number>,
    delay = 1200
  ) => {
    const now = Date.now();

    if (now - ref.current < delay) return false;

    ref.current = now;
    return true;
  };

  return { canRunAction };
}