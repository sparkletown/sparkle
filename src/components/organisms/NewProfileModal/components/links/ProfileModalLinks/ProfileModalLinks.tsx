import React, { useMemo } from "react";

import { User } from "types/User";
import { ContainerClassName } from "types/utility";

import { WithId } from "utils/id";

import { ProfileModalLink } from "components/organisms/NewProfileModal/components/links/ProfileModalLinks/ProfileModalLink";

import "./ProfileModalLinks.scss";

interface Props extends ContainerClassName {
  viewingUser: WithId<User>;
}

export const ProfileModalLinks: React.FC<Props> = ({
  containerClassName,
  viewingUser,
}) => {
  const renderedProfileLinks = useMemo(
    () =>
      viewingUser?.profileLinks?.map((link, i) => (
        <ProfileModalLink
          containerClassName="ProfileModalLinks__link"
          link={link}
          key={link.url}
        />
      )),
    [viewingUser?.profileLinks]
  );

  return <div className={containerClassName}>{renderedProfileLinks}</div>;
};
