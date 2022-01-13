import React from "react";
import hoistNonReactStatics from "hoist-non-react-statics";

import { determineDisplayName } from "utils/hoc";

type WithRequiredOptions = string[]; // | Function | object

export const withRequired =
  (options: WithRequiredOptions) => (WrappedComponent: React.FC) => {
    console.log(withRequired.name, "wrapping...");
    const WithRequired: React.FC = (props) => {
      const haystack = Object.entries(props);

      const invalidParam = (needle: string) =>
        !haystack.find(
          ([name, value]) =>
            name === needle && value !== null && value !== undefined
        );

      if (Array.isArray(options) && options.some(invalidParam)) {
        console.log(WithRequired.name, "rendering empty fragment...");
        return <></>;
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
