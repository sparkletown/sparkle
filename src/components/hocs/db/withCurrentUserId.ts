import React, { PropsWithChildren } from "react";

import { hoistHocStatics } from "utils/hoc";

import { useUserId } from "hooks/user/useUserId";

export const withCurrentUserId = <T = {}>(Component: React.FC<T>) => {
  const WithCurrentUserId = (props: PropsWithChildren<T>) => {
    const { userId } = useUserId();
    return React.createElement(Component, { ...props, userId });
  };

  hoistHocStatics("withCurrentUserId", WithCurrentUserId, Component);
  return WithCurrentUserId;
};
