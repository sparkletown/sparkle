import React from "react";
import hoistNonReactStatics from "hoist-non-react-statics";

import { determineDisplayName } from "utils/hoc";

type WithRequiredOptions =
  | string[]
  | {
      required: string[];
      fallback: React.FC;
    };

export const withRequired =
  (options: WithRequiredOptions) => (WrappedComponent: React.FC) => {
    console.log(withRequired.name, "wrapping...");
    const WithRequired: React.FC = (props) => {
      const haystack = Object.entries(props);

      const invalidProp = (needle: string) =>
        !haystack.find(
          ([name, value]) =>
            name === needle && value !== null && value !== undefined
        );

      const isArray = Array.isArray(options);

      if (isArray && options.some(invalidProp)) {
        console.log(WithRequired.name, "rendering empty fragment...");
        return <></>;
      }

      if (!isArray) {
        const required = options?.required ?? [];
        if (required.some(invalidProp)) {
          const Fallback = options?.fallback;
          return Fallback ? <Fallback {...props} /> : <></>;
        }
      }
      console.log(WithRequired.name, "rendering component...");
      return <WrappedComponent {...props} />;
    };

    hoistNonReactStatics(WithRequired, WrappedComponent);

    WithRequired.displayName = `withRequired(${determineDisplayName(
      WrappedComponent
    )}}`;

    return WithRequired;
  };
