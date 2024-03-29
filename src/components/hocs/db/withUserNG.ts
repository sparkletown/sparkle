import React, { PropsWithChildren, useMemo } from "react";

import { hoistHocStatics } from "utils/hoc";

import { useLiveUser } from "hooks/user/useLiveUser";

export const withUserNG = <T = {}>(Component: React.FC<T>) => {
  const WithUserNG = (props: PropsWithChildren<T>) => {
    const {
      authError,
      profileError,
      isLoading: isUserNGLoading,
      isLoaded: isUserNGLoaded,
      auth,
      userId,
      profile,
      isTester,
    } = useLiveUser();

    const memoizedProps = useMemo(
      () => ({
        ...props,
        isUserNGLoading,
        isUserNGLoaded,
        auth,
        userId,
        profile,
        isTester,
      }),
      [props, isUserNGLoading, isUserNGLoaded, auth, userId, profile, isTester]
    );

    if (authError || profileError) {
      // @debt add Bugsnag here
      console.error(withUserNG.name, authError, profileError);
      return null;
    }

    return React.createElement(Component, memoizedProps);
  };

  hoistHocStatics("withUserNG", WithUserNG, Component);
  return WithUserNG;
};
