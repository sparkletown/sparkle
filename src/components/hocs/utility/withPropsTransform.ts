import React, { PropsWithChildren } from "react";

import { hoistHocStatics } from "utils/hoc";

export const withPropsTransform = <Tnew = {}, Told = {}>(
  transform: (props: PropsWithChildren<Told>) => PropsWithChildren<Tnew>
) => (Component: React.FC<Tnew>): React.FC<Told> => {
  const WithPropsTransform = (props: Told) =>
    React.createElement(Component, transform(props));

  const suffix = transform?.name ? `:${transform.name}` : "";
  hoistHocStatics("withPropsTransform" + suffix, WithPropsTransform, Component);
  return WithPropsTransform;
};
