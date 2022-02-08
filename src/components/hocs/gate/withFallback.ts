import React, { PropsWithChildren } from "react";
import { get } from "lodash/fp";

import {
  checkBlockerProp,
  determineDisplayName,
  hoistHocStatics,
} from "utils/hoc";

export const withFallback = <T = {}>(
  test: string[] | ((props: PropsWithChildren<T>) => unknown),
  fallback: React.FC<T>
) => (component: React.FC<T>): React.FC<T> => {
  const isArray = Array.isArray(test);
  const testFn = isArray
    ? (props: object) => !test.some((key) => checkBlockerProp(get(key, props)))
    : test;

  const WithFallback = (props: PropsWithChildren<T>) =>
    testFn(props)
      ? React.createElement(component, props)
      : React.createElement(fallback, props);

  const fallbackName = determineDisplayName(fallback, { defaultName: "" });
  const testSuffix = isArray ? ":" + test : "";
  const nameSuffix = fallbackName ? ":" + fallbackName : "";
  hoistHocStatics(
    "withFallback" + nameSuffix + testSuffix,
    WithFallback,
    component
  );

  return WithFallback;
};
