"use client";

import { useEffect } from "react";

/** Locks document scroll while `locked` is true (e.g. mobile nav open). */
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;

    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = original;
    };
  }, [locked]);
}
