import React, { PropsWithChildren } from "react";

import { hoistHocStatics } from "utils/hoc";

import { useLoginCheck } from "hooks/user/useLoginCheck";

export const withAuth = <T = {}>(Component: React.FC<T>) => {
  const WithAuth = (props: PropsWithChildren<T>) => {
    const { error, user, userId, isLoading } = useLoginCheck();

    if (error) {
      // @debt add Bugsnag here
      console.error(withAuth.name, error);
      return null;
    }

    if (isLoading) {
      return null;
    }
    if (!userId || !user) {
      return null;
    }

    return React.createElement(Component, { ...props, auth: user, userId });
  };

  hoistHocStatics("withAuth", WithAuth, Component);
  return WithAuth;
};
