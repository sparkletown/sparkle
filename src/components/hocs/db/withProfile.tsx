import React from "react";

import { RefiAuthUser } from "types/reactfire";
import { Profile, User, UserLocation } from "types/User";

import { hoistHocStatics } from "utils/hoc";
import { WithId } from "utils/id";

import { useProfile } from "hooks/user/useProfile";

interface WithProfileInProps {
  auth: RefiAuthUser;
  isLoading: boolean;
}

export interface WithProfileOutProps {
  profile?: Profile;
  userLocation?: UserLocation;
  userWithId?: WithId<User>;
  isTester: boolean;
}

type WithProfile = <T extends object = object>(
  Component: React.FC<T & WithProfileOutProps>
) => React.FC<Omit<T & WithProfileInProps, keyof WithProfileOutProps>>;

export const withProfile: WithProfile = (Component) => {
  const WithProfile = (props: WithProfileInProps) => {
    const {
      error,
      isLoading,
      profile,
      userLocation,
      userWithId,
      isTester,
    } = useProfile({ user: props.auth });

    if (error) {
      // @debt add Bugsnag here
      console.error(withProfile.name, error);
      return null;
    }

    if (props.isLoading || isLoading) {
      return null;
    }

    if (!profile || !userLocation || !userWithId) {
      return null;
    }

    const C = (Component as unknown) as React.FC<
      typeof props & WithProfileOutProps
    >;
    return (
      <C
        {...props}
        profile={profile}
        userLocation={userLocation}
        userWithId={userWithId}
        isTester={isTester}
      />
    );
  };

  hoistHocStatics("withProfile", WithProfile, Component);
  return WithProfile;
};
