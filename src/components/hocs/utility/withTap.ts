import React, { PropsWithChildren } from "react";

import { hoistHocStatics } from "utils/hoc";

type TapFunction<T = {}> = (context: {
  component: React.FC<T>;
  props: PropsWithChildren<T>;
}) => void;

export const withTap = <T = {}>(tap: TapFunction<T>) => (
  Component: React.FC<T>
): React.FC<T> => {
  const WithTap = (props: T) => {
    tap({ props, component: Component });
    return React.createElement(Component, props);
  };

  const suffix = tap?.name ? `:${tap.name}` : "";
  hoistHocStatics("withTap" + suffix, WithTap, Component);
  return WithTap;
};
