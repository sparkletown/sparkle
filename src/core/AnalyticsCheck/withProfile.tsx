import React from "react";

import { determineDisplayName } from "utils/hoc";

import { useProfile } from "hooks/user/useProfile";

import { AnalyticsCheckLoginProps, AnalyticsCheckProfileProps } from "./props";

export const withProfile = () => (
  Component: React.FC<AnalyticsCheckLoginProps>
): React.FC<AnalyticsCheckProfileProps> => {
  const WithProfile: React.FC<AnalyticsCheckLoginProps> = (props) => {
    const result = useProfile({ user: props.user });

    if (result.error) {
      console.error(withProfile.name, result.error);
      return null;
    }

    if (result.isLoading) {
      return null;
    }

    return <Component {...props} {...result} />;
  };

  WithProfile.displayName = `withProfile(${determineDisplayName(Component)})`;
  return WithProfile;
};
