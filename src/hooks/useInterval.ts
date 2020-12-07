import { useEffect, useRef } from "react";

/**
 * React hook that simplifies using setInterval() within functional components.
 *
 * Note: You don't need to memoise/useCallback the handler as we store it with
 * a ref internally.
 *
 * Note: If `intervalInMs` is `null` or `undefined`, this hook will do nothing
 * (essentially becomes a noop). You can use this as a way to add a 'conditional
 * element' to without conditionally calling the hook itself.
 *
 * @param handler the function to be called every tick of the interval
 * @param intervalInMs the interval time in milliseconds. If falsy, the hook
 * will not set the interval, and will essentially be a noop.
 */
export const useInterval = (handler: () => void, intervalInMs?: number) => {
  // Store the handler as the initial default value
  const handlerRef = useRef(handler);

  // Make sure we keep handlerRef updated if handler changes
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!intervalInMs) return;

    // Create a stable wrapper around handlerRef to pass to setInterval
    const tick = () => {
      handlerRef.current();
    };

    const id = setInterval(tick, intervalInMs);
    return () => clearInterval(id);
  }, [intervalInMs]);
};
