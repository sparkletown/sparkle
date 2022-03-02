import React, { PropsWithChildren } from "react";

import { hoistHocStatics } from "utils/hoc";

import { useUserId } from "hooks/user/useUserId";

type Props<T> = PropsWithChildren<T>;

export const withAuth = <T = {}>(Component: React.FC<T>) => {
  const WithAuth = (props: Props<T>) => {
    const { error, auth, userId, isLoading } = useUserId();

    if (error) {
      // @debt add Bugsnag here
      console.error(withAuth.name, error);
    }

    return React.createElement(Component, {
      ...props,
      auth,
      userId,
      isAuthLoading: isLoading,
      isAuthLoaded: !isLoading,
    });
  };

  hoistHocStatics("withAuth", WithAuth, Component);
  return WithAuth;
};
