import React, { PropsWithChildren } from "react";

import { hoistHocStatics } from "utils/hoc";

export const withFallback = <T = {}>(
  test: (props: PropsWithChildren<T>) => unknown,
  fallback: React.FC<T>
) => (Component: React.FC<T>): React.FC<T> => {
  const WithFallback = (props: T) =>
    test(props)
      ? React.createElement(Component, props)
      : fallback
      ? React.createElement(fallback, props)
      : React.createElement(React.Fragment);

  hoistHocStatics("withFallback", WithFallback, Component);
  return WithFallback;
};
