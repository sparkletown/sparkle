import React from "react";
import { omit } from "lodash/fp";

import { LoadStatus } from "types/fire";

import { hoistHocStatics } from "utils/hoc";

export const withHook = <R extends LoadStatus, T = {}>(
  tag: string,
  useHook: (options: T) => R
) => (Component: React.FC<T>) => {
  const WithHook = (props: T) => {
    const result = useHook(props);

    return React.createElement(Component, {
      ...props,
      ...omit(["error", "isLoading", "isLoaded"], result),
      [`is${tag}Loading`]: result.isLoading,
      [`is${tag}Loaded`]: result.isLoaded,
      [`or${tag}Error`]: result.error,
    });
  };

  hoistHocStatics("withHook:" + tag, WithHook, Component);
  return WithHook;
};
