/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useRef } from "react";

export function useDedupeRequest() {
  const activeRequestsRef = useRef<Record<string, Promise<any> | undefined>>({});

  const dedupeRequest = async <T,>(
    key: string,
    requestFn: () => Promise<T>
  ): Promise<T> => {
    if (activeRequestsRef.current[key]) {
      return activeRequestsRef.current[key] as Promise<T>;
    }

    const request = requestFn().finally(() => {
      delete activeRequestsRef.current[key];
    });

    activeRequestsRef.current[key] = request;

    return request;
  };

  return { dedupeRequest };
}