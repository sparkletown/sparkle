import React, { useMemo } from "react";

import { User } from "types/User";
import { ContainerClassName } from "types/utility";

import { WithId } from "utils/id";

import { ProfileModalLink } from "components/organisms/NewProfileModal/components/links/ProfileModalLinks/ProfileModalLink";

import "./ProfileModalLinks.scss";

export interface ProfileModalLinksProps extends ContainerClassName {
  user: WithId<User>;
}

export const ProfileModalLinks: React.FC<ProfileModalLinksProps> = ({
  containerClassName,
  user,
}) => {
  const renderedProfileLinks = useMemo(
    () =>
      user?.profileLinks?.map((link, i) => (
        <ProfileModalLink
          containerClassName="ProfileModalLinks__link"
          link={link}
          key={link.url}
        />
      )),
    [user?.profileLinks]
  );

  return <div className={containerClassName}>{renderedProfileLinks}</div>;
};
