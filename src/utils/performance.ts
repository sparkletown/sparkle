import firebase from "firebase/app";

export {
  unstable_trace as traceReactScheduler,
  unstable_wrap as wrapReactScheduler,
} from "scheduler/tracing";

/**
 * A centralised location to track all custom code trace names used within the app.
 *
 * Note: Names for custom code traces must meet the following requirements:
 *   - no leading or trailing whitespace
 *   - no leading underscore (_) character
 *   - max length is 100 characters
 *
 * @see createPerformanceTrace
 * @see https://firebase.google.com/docs/perf-mon/custom-code-traces?platform=web#add-custom-code-traces
 */
export enum PerformanceTrace {
  initStripeLoad = "INIT_STRIPE_LOAD",
}

export type CreatePerformanceTraceOptions = {
  /**
   * Whether the trace should be started as soon as its created.
   */
  startNow?: boolean;

  /**
   * Add initial custom attribute data to be included with the trace.
   *
   * Note: You can add/remove attributes with trace.putAttribute() / trace.removeAttribute()
   * Note: You can set the custom attribute anytime between when the trace starts and when the trace stops.
   *
   * Each custom code trace can record up to 5 custom attributes.
   *
   * You shouldn't use custom attributes that contain information that personally identifies an individual to Google.
   *
   * Names for custom attributes must meet the following requirements:
   *   - no leading or trailing whitespace,
   *   - no leading underscore (_) character
   *   - max length is 32 characters
   *
   * @see https://firebase.google.com/docs/perf-mon/custom-code-traces?platform=web#create-custom-attributes
   */
  attributes?: { [key: string]: string }; // @debt This can't use Map<string, string> due to https://github.com/microsoft/TypeScript/issues/15300

  /**
   * Add initial custom metrics data to be included with the trace.
   *
   * Note: You can add additional data later with trace.putMetric(), and increment it with trace.incrementMetric()
   *
   * Each custom code trace can record up to 32 metrics (including the default Duration metric).
   *
   * Names for custom metrics must meet the following requirements:
   *   - no leading or trailing whitespace
   *   - no leading underscore (_) character
   *   - max length is 100 characters
   *
   * @see https://firebase.google.com/docs/perf-mon/custom-code-traces?platform=web#add-custom-metrics
   */
  metrics?: { [key: string]: number }; // @debt This can't use Map<string, number> due to https://github.com/microsoft/TypeScript/issues/15300
};

/**
 * Create a new Trace instance, optionally configuring it.
 *
 * Note: Trace data will only be sent if trace.stop() is called after trace.start()
 *
 * @example
 *   const traceFoo = createPerformanceTrace(PerformanceTrace.initFooLoad, { startNow: true });
 *   loadFoo().finally(() => {
 *     traceStripe.stop()
 *   })
 *
 * @param traceName The name of the trace instance
 * @param options see CreatePerformanceTraceOptions
 *
 * @see https://firebase.google.com/docs/perf-mon/custom-code-traces?platform=web
 * @see https://firebase.google.com/docs/reference/js/firebase.performance.Performance#trace
 * @see https://firebase.google.com/docs/reference/js/firebase.performance.Trace
 */
export const createPerformanceTrace = (
  traceName: PerformanceTrace | string,
  options?: CreatePerformanceTraceOptions
) => {
  const { startNow = false, attributes, metrics } = options ?? {};

  // Create a new Trace instance
  const trace = firebase.performance().trace(traceName);

  // Configure our starting attributes
  if (attributes !== undefined) {
    Object.entries<string>(attributes).forEach(
      ([attributeName, attributeValue]) => {
        trace.putAttribute(attributeName, attributeValue);
      }
    );
  }

  // Configure our starting metrics
  if (metrics !== undefined) {
    Object.entries<number>(metrics).forEach(([metricName, metricValue]) => {
      trace.putMetric(metricName, metricValue);
    });
  }

  if (startNow) {
    trace.start();
  }

  return trace;
};

export interface TracePromiseOptions extends CreatePerformanceTraceOptions {
  withDebugLog?: boolean;
  debugLogFunc?: (...args: unknown[]) => void;
}

/**
 * Create a new Trace instance that wraps a Promise, optionally configuring it. The trace starts
 * as soon as the Promise is created, and ends when the Promise finishes (whether successfully or
 * with an error)
 *
 * @example Basic Usage
 *   const resultPromise Promise<Bar> = tracePromise(
 *     "Foo::fetchBar",
 *     () => fetchBar("baz"),
 *   );
 *
 * @example Usage with options
 *   const resultPromise Promise<Bar> = tracePromise(
 *     "Foo::fetchBar",
 *     () => fetchBar("baz"),
 *     {
 *       attributes: {
 *         bazParam: "baz",
 *       },
 *     }
 *   );
 *
 * @param traceName The name of the trace instance
 * @param createPromise a function wrapper that creates the Promise to be traced
 * @param options see CreatePerformanceTraceOptions
 *
 * @see https://firebase.googleblog.com/2021/03/rtdb-performance-monitoring.html
 */
export const tracePromise = <T>(
  traceName: PerformanceTrace | string,
  createPromise: () => Promise<T>,
  options?: TracePromiseOptions
): Promise<T> => {
  const {
    withDebugLog = false,
    debugLogFunc = console.log,
    ...createPerformanceTraceOptions
  } = options ?? {};

  const trace = createPerformanceTrace(
    traceName,
    createPerformanceTraceOptions
  );

  if (withDebugLog) {
    debugLogFunc(`tracePromise::${traceName}::started`, trace);
  }

  trace.start();
  return createPromise().finally(() => {
    trace.stop();

    if (withDebugLog) {
      debugLogFunc(`tracePromise::${traceName}::finished`, trace);
    }
  });
};
