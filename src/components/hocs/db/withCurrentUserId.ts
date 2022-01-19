import React, { PropsWithChildren } from "react";
import { useAuth } from "reactfire";

import { hoistHocStatics } from "utils/hoc";

export const withCurrentUserId = <T = {}>(Component: React.FC<T>) => {
  const WithCurrentUserId = (props: PropsWithChildren<T>) => {
    const auth = useAuth();
    const userId = auth.currentUser?.uid;
    return React.createElement(Component, { ...props, userId });
  };

  hoistHocStatics("withCurrentUserId", WithCurrentUserId, Component);
  return WithCurrentUserId;
};
