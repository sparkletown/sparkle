import { ProfileModalLink } from "./ProfileModalLink";
import React, { useMemo } from "react";
import { ContainerClassName } from "../../../../../types/utility";
import { User } from "../../../../../types/User";
import { WithId } from "../../../../../utils/id";

interface Props extends ContainerClassName {
  user: WithId<User>;
}

export const ProfileModalLinks: React.FC<Props> = ({
  containerClassName,
  user,
}) => {
  const renderedProfileLinks = useMemo(
    () =>
      user?.profileLinks?.map((link) => (
        <ProfileModalLink link={link} key={link.title} />
      )),
    [user?.profileLinks]
  );

  return <div className={containerClassName}>{renderedProfileLinks}</div>;
};
