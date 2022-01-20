import React from "react";

import { RefiAuthUser } from "types/fire";

import { hoistHocStatics } from "utils/hoc";

import { useProfile } from "hooks/user/useProfile";

type Attributes = { auth: RefiAuthUser };
type Props<T extends Attributes> = T;

export const withProfile = <T extends Attributes>(
  Component: React.FC<Props<T>>
) => {
  const WithProfile = (props: Props<T>) => {
    const {
      error: profileError,
      isLoading: isProfileLoading,
      isLoaded: isProfileLoaded,
      profile,
      userLocation,
      userWithId,
      isTester,
    } = useProfile(props);

    return React.createElement(Component, {
      ...props,
      profile,
      userLocation,
      userWithId,
      isTester,
      isProfileLoading,
      isProfileLoaded,
      profileError,
    });
  };

  hoistHocStatics("withProfile", WithProfile, Component);
  return WithProfile;
};
