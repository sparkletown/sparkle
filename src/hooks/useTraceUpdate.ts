import { useEffect, useRef } from "react";

interface ObjectDict {
  [index: string]: unknown;
}

export const useTraceUpdate = (props: Record<string, unknown>) => {
  const prev = useRef(props);
  useEffect(() => {
    const changedProps = Object.entries(props).reduce(
      (lookup: ObjectDict, [key, value]) => {
        if (prev.current[key] !== value) {
          lookup[key] = [prev.current[key], value];
        }
        return lookup;
      },
      {}
    );
    if (Object.keys(changedProps).length > 0) {
      console.log("Changed props:", changedProps);
    }
    prev.current = props;
  });
};
