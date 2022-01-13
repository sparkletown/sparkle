import React from "react";

import { determineDisplayName } from "utils/hoc";

import { useLoginCheck } from "hooks/user/useLoginCheck";

import { AnalyticsCheckLoginProps, AnalyticsCheckProps } from "./props";

export const withLogin =
  () =>
  (
    Component: React.FC<AnalyticsCheckProps>
  ): React.FC<AnalyticsCheckLoginProps> => {
    console.log(withLogin.name, "wrapping..");

    const WithLogin: React.FC = (props) => {
      const { error, user, userId, isLoading } = useLoginCheck();

      if (error) {
        console.error(withLogin.name, error);
        return null;
      }

      if (isLoading) {
        return null;
      }

      console.log(WithLogin.name, "rendering...", user);
      return <Component {...props} user={user} userId={userId} />;
    };

    WithLogin.displayName = `withLogin(${determineDisplayName(Component)})`;
    return WithLogin;
  };
