"use client";

import { useEffect, useState, type RefObject } from "react";

interface MousePosition {
  x: number;
  y: number;
}

/**
 * Tracks normalized mouse position (-0.5 to 0.5) relative to a container,
 * or to the viewport if no ref is provided. Used for subtle parallax effects.
 */
export function useMousePosition(ref?: RefObject<HTMLElement | null>): MousePosition {
  const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0 });

  useEffect(() => {
    const target = ref?.current ?? window;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = ref?.current?.getBoundingClientRect();
      const width = rect?.width ?? window.innerWidth;
      const height = rect?.height ?? window.innerHeight;
      const offsetX = rect?.left ?? 0;
      const offsetY = rect?.top ?? 0;

      const x = (event.clientX - offsetX) / width - 0.5;
      const y = (event.clientY - offsetY) / height - 0.5;

      setPosition({ x, y });
    };

    target.addEventListener("mousemove", handleMouseMove as EventListener);
    return () => target.removeEventListener("mousemove", handleMouseMove as EventListener);
  }, [ref]);

  return position;
}
