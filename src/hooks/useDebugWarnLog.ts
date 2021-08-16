import { DependencyList, useEffect, useRef } from "react";

/**
 * This hook is a development helper to try and figure out why components
 * may be re-rendering (and how many times). Internally it uses React's useEffect hook,
 * and logs a useful warning message to the JS console when the memo is invalidated.
 *
 * @param deps the array of dependencies that will be passed directly to useEffect
 * @param label to help you differentiate between different instances in the JS console
 * @param context additional context to be displayed alongside the log message
 *
 * @example
 *   const somethingThatMayCauseReRenders = () => {}
 *   const usefulContext = 42
 *
 *   useDebugWarnLog([somethingThatMayCauseReRenders], "FooComponent::barLabel", { usefulContext })
 *   // [useDebugWarnLog::FooComponent::barLabel] deps changed, will cause re-render (count: 1), { usefulContext }
 */
export const useDebugWarnLog = (
  deps: DependencyList,
  label?: string,
  context?: Record<string, unknown>
) => {
  const countRef = useRef(0);

  useEffect(() => {
    countRef.current += 1;

    const prefix = label ? `[useDebugWarnLog::${label}]` : "[useDebugWarnLog]";
    displayWarning(
      `${prefix} (count: ${countRef.current})`,
      `deps changed, will cause re-render`,
      context
    );
    // We are consciously using a dynamic props pattern here as it is a helper
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, label]);
};

const warningStyles = "color: var(--warning, #F39C12)";

const displayWarning = (
  title: string,
  msg: string,
  context?: Record<string, unknown>
) => {
  console.groupCollapsed(`%c${title}`, warningStyles);
  console.log(msg, context);
  console.groupCollapsed("click to show stacktrace");
  console.warn("stacktrace");
  console.groupEnd();
  console.groupEnd();
};
