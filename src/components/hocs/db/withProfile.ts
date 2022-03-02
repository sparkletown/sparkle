import React from "react";

import { FireAuthUser } from "types/fire";

import { hoistHocStatics } from "utils/hoc";

import { useLiveProfile } from "hooks/user/useLiveProfile";

type Attributes = { auth: FireAuthUser };
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
    } = useLiveProfile(props);

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
