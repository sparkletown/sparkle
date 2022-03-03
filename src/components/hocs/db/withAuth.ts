import React, { PropsWithChildren } from "react";

import { RefiAuthUser } from "types/fire";
import { UserId } from "types/id";

import { hoistHocStatics } from "utils/hoc";

import { useLoginCheck } from "hooks/user/useLoginCheck";

type Props<T> = PropsWithChildren<T>;

export type WithAuthProps = {
  isAuthLoading: boolean;
  isAuthLoaded: boolean;
  auth?: RefiAuthUser;
  userId?: UserId;
};

export const withAuth = <T = {}>(Component: React.FC<T>) => {
  const WithAuth = (props: Props<T>) => {
    const { error, user, userId, isLoading } = useLoginCheck();

    if (error) {
      // @debt add Bugsnag here
      console.error(withAuth.name, error);
    }

    return React.createElement(Component, {
      ...props,
      auth: user,
      userId,
      isAuthLoading: isLoading,
      isAuthLoaded: !isLoading,
    });
  };

  hoistHocStatics("withAuth", WithAuth, Component);
  return WithAuth;
};
