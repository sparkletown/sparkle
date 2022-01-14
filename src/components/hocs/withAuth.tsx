import React from "react";

import { UserId } from "types/id";
import { RefiAuthUser } from "types/reactfire";

import { determineDisplayName } from "utils/hoc";

import { useLoginCheck } from "hooks/user/useLoginCheck";

type WithAuthOutProps = { auth: RefiAuthUser; userId: UserId };

type WithAuth = <T>(
  Component: React.FC<WithAuthOutProps>
) => React.FC<Omit<T, keyof WithAuthOutProps>>;

export const withAuth: WithAuth = (Component) => {
  const Wrapper: React.FC = (props) => {
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

    return <Component {...props} auth={user} userId={userId} />;
  };

  Wrapper.displayName = `withAuth(${determineDisplayName(Component)})`;
  return Wrapper;
};
