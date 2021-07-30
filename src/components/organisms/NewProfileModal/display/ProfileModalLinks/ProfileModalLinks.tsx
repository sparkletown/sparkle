import { ProfileModalLink } from "./ProfileModalLink";
import React, { useMemo } from "react";
import { ContainerClassName } from "../../../../../types/utility";
import { User } from "../../../../../types/User";
import { WithId } from "../../../../../utils/id";

interface Props extends ContainerClassName {
  viewingUser: WithId<User>;
}

export const ProfileModalLinks: React.FC<Props> = ({
  containerClassName,
  viewingUser,
}) => {
  const renderedProfileLinks = useMemo(
    () =>
      viewingUser?.profileLinks?.map((link) => (
        <ProfileModalLink link={link} key={link.title} />
      )),
    [viewingUser?.profileLinks]
  );

  return <div className={containerClassName}>{renderedProfileLinks}</div>;
};
