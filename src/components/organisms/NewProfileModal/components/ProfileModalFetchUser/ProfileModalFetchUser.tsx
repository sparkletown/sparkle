import React from "react";
import { FalseyValue } from "styled-components";

import { User } from "types/User";

import { WithId } from "utils/id";

import { Loading } from "components/molecules/Loading";

import { useCurrentModalUser } from "./useCurrentModalUser";

import "./ProfileModalFetchUser.scss";

export interface ProfileModalFetchUserProps {
  userId?: string;
  children: (user: WithId<User>) => React.ReactElement | FalseyValue | "";
}

export const ProfileModalFetchUser: React.FC<ProfileModalFetchUserProps> = ({
  userId,
  children,
}: ProfileModalFetchUserProps) => {
  const [user, isLoaded] = useCurrentModalUser(userId);

  if (isLoaded && user) return <>{children(user)}</>;

  if (!isLoaded)
    return (
      <div className="ProfileModalFetchUser">
        <Loading />
      </div>
    );

  if (!user)
    return (
      <div className="ProfileModalFetchUser">
        Oops, an error occurred while trying to load user data.{"\n"}
        Please contact our support team.
      </div>
    );

  return <></>;
};
