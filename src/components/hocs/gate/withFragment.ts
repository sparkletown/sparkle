import React, { PropsWithChildren } from "react";

import { hoistHocStatics } from "utils/hoc";

export const withFragment = <T = {}>(
  test: (props: PropsWithChildren<T>) => unknown
) => (Component: React.FC<T>) => {
  const WithFragment: typeof Component = (props: T) =>
    test(props)
      ? React.createElement(Component, props)
      : React.createElement(React.Fragment, props);

  hoistHocStatics("withFragment", WithFragment, Component);
  return WithFragment;
};
