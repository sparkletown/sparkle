import React from "react";

import { RefiAuthUser } from "types/reactfire";
import { Profile, User, UserLocation } from "types/User";

import { determineDisplayName } from "utils/hoc";
import { WithId } from "utils/id";

import { useProfile } from "hooks/user/useProfile";

interface WithProfileInProps {
  user: RefiAuthUser;
  isLoading: boolean;
}

interface WithProfileOutProps {
  profile?: Profile;
  userLocation?: UserLocation;
  userWithId?: WithId<User>;
  isTester: boolean;
}

type WithProfile = <T extends object = object>(
  Component: React.FC<WithProfileOutProps>
) => React.FC<Omit<T & WithProfileInProps, keyof WithProfileOutProps>>;

export const withProfile: WithProfile = (Component) => {
  const WithProfile = (props: WithProfileInProps) => {
    const { error, isLoading, profile, userLocation, userWithId, isTester } =
      useProfile({ user: props.user });

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

    return (
      <Component
        {...props}
        profile={profile}
        userLocation={userLocation}
        userWithId={userWithId}
        isTester={isTester}
      />
    );
  };

  WithProfile.displayName = `withProfile(${determineDisplayName(Component)})`;
  return WithProfile;
};
