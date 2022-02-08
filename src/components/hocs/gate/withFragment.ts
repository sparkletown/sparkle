import React, { PropsWithChildren } from "react";
import { get } from "lodash/fp";

import { checkBlockerProp, hoistHocStatics } from "utils/hoc";

export const withFragment = <T = {}>(
  test: string[] | ((props: PropsWithChildren<T>) => unknown)
) => (component: React.FC<T>): React.FC<T> => {
  const isArray = Array.isArray(test);
  const testFn = isArray
    ? (props: object) => !test.some((key) => checkBlockerProp(get(key, props)))
    : test;

  const WithFragment = (props: PropsWithChildren<T>) =>
    testFn(props)
      ? React.createElement(component, props)
      : React.createElement(React.Fragment);

  const testSuffix = isArray ? ":" + test : "";
  hoistHocStatics("withFragment" + testSuffix, WithFragment, component);

  return WithFragment;
};
