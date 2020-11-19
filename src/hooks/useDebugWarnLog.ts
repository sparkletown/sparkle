import { DependencyList, useEffect, useRef } from "react";

/**
 * This hook is a development helper to try and figure out why components
 * may be re-rendering (and how many times). Internally it uses React's useEffect hook,
 * and logs a useful warning message to the JS console when the memo is invalidated.
 *
 * @param deps the array of dependencies that will be passed directly to useEffect
 * @param label to help you differentiate between different instances in the JS console
 *
 * @example
 *   const somethingThatMayCauseReRenders = () => {}
 *
 *   useDebugWarnLog([somethingThatMayCauseReRenders], "FooComponent::barLabel")
 *   // [useDebugWarnLog::FooComponent::barLabel] deps changed, will cause re-render (count: 1)
 */
export const useDebugWarnLog = (deps: DependencyList, label?: String) => {
  const countRef = useRef(0);

  useEffect(() => {
    countRef.current += 1;

    const prefix = label ? `[useDebugWarnLog::${label}]` : "[useDebugWarnLog]";
    console.warn(
      prefix,
      "deps changed, will cause re-render",
      `(count: ${countRef.current})`
    );
    // We are consciously using a dynamic props pattern here as it is a helper
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, label]);
};
