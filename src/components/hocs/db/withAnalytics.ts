import React from "react";

import { SpaceWithId } from "types/id";

import { hoistHocStatics } from "utils/hoc";

import { useAnalytics } from "hooks/useAnalytics";

type Attributes = { space: SpaceWithId };
type Props<T extends Attributes> = T;

export const withAnalytics = <T extends Attributes>(
  Component: React.FC<Props<T>>
) => {
  const WithAnalytics = (props: Props<T>) => {
    const result = useAnalytics({ venue: props.space });
    return React.createElement(Component, { ...props, ...result });
  };

  hoistHocStatics("withAnalytics", WithAnalytics, Component);
  return WithAnalytics;
};
