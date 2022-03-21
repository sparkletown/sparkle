import React, { PropsWithChildren } from "react";
import {
  ErrorBoundary,
  ErrorBoundaryFallbackProps,
  ErrorBoundaryProps,
} from "core/ErrorBoundary";

import { hoistHocStatics } from "utils/hoc";

export const withErrorBoundary = <T extends ErrorBoundaryProps = {}>(
  fallback?: React.FC<T & ErrorBoundaryFallbackProps>
) => (component: React.FC<T>): React.FC<T> => {
  const WithErrorBoundary = (props: PropsWithChildren<T>) =>
    React.createElement(
      ErrorBoundary,
      { ...props, fallback },
      React.createElement(component, props)
    );

  hoistHocStatics("withErrorBoundary", WithErrorBoundary, component);

  return WithErrorBoundary;
};
