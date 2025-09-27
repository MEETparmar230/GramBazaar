import { useRef, useEffect, useCallback } from "react";

/**
 * Strongly-typed throttle hook without `any`.
 * Usage: const throttled = useThrottle((id: string) => { ... }, 1000);
 */
export function useThrottle<Args extends unknown[]>(
  callback: (...args: Args) => void | Promise<void>,
  delay: number
) {
  const lastCall = useRef(0);

  // keep callback in ref so throttled function is stable even if callback changes
  const cbRef = useRef(callback);
  useEffect(() => {
    cbRef.current = callback;
  }, [callback]);

  return useCallback((...args: Args): void => {
    const now = Date.now();
    if (now - lastCall.current >= delay) {
      lastCall.current = now;
      // ignore returned Promise to not block throttling
      void cbRef.current(...args);
    }
  }, [delay]);
}
