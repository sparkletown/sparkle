import React from "react";

import { hoistHocStatics } from "utils/hoc";

type WithRequiredOptions =
  | string[]
  | {
      required: string[];
      fallback: React.FC;
    };

export const withRequired = (options: WithRequiredOptions) => (
  Component: React.FC
) => {
  const isArray = Array.isArray(options);
  const required = (isArray ? options : options?.required) ?? [];

  const WithRequired: React.FC = (props) => {
    const haystack = Object.entries(props);

    const invalidProp = (needle: string) =>
      !haystack.find(
        ([name, value]) =>
          name === needle && value !== null && value !== undefined
      );

    if (isArray && options.some(invalidProp)) {
      return <></>;
    }

    if (!isArray) {
      if (required.some(invalidProp)) {
        const Fallback = options?.fallback;
        return Fallback ? <Fallback {...props} /> : <></>;
      }
    }

    return <Component {...props} />;
  };

  hoistHocStatics("withRequired(" + required + ")", WithRequired, Component);
  return WithRequired;
};
