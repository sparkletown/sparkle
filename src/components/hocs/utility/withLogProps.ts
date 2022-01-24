import React from "react";

import { determineDisplayName, hoistHocStatics } from "utils/hoc";

export const withLogProps = <T = {}>(tag: string) => (
  Component: React.FC<T>
): React.FC<T> => {
  const displayName = determineDisplayName(Component);

  const WithLogProps = (props: T) => {
    console.log(tag, ":", displayName, ":", props);
    return React.createElement(Component, props);
  };

  hoistHocStatics("withLogProps", WithLogProps, Component);
  return WithLogProps;
};
