import React, { PropsWithChildren } from "react";

import { hoistHocStatics } from "utils/hoc";

type WithRequiredOptions<T> =
  | string[]
  | {
      required: string[];
      fallback: React.FC<T>;
    };

export const withRequired = <T = {}>(options: WithRequiredOptions<T>) => (
  component: React.FC<T>
) => {
  const isArray = Array.isArray(options);
  const required = (isArray ? options : options?.required) ?? [];

  const WithRequired = (props: PropsWithChildren<T>) => {
    const haystack = Object.entries(props);

    const invalidProp = (needle: string) =>
      !haystack.find(
        ([name, value]) =>
          name === needle && value !== null && value !== undefined
      );

    if (isArray && options.some(invalidProp)) {
      return React.createElement(React.Fragment, {});
    }

    if (!isArray) {
      if (required.some(invalidProp)) {
        return options?.fallback
          ? React.createElement(options?.fallback, props)
          : React.createElement(React.Fragment, {});
      }
    }

    return React.createElement(component, props);
  };

  hoistHocStatics("withRequired:" + required, WithRequired, component);
  return WithRequired;
};
