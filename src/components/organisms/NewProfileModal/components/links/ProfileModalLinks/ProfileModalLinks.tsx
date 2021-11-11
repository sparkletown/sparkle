import React, { useMemo } from "react";

import { User } from "types/User";

import { WithId } from "utils/id";

import { ProfileModalLink } from "components/organisms/NewProfileModal/components/links/ProfileModalLinks/ProfileModalLink";

import "./ProfileModalLinks.scss";

export interface ProfileModalLinksProps {
  user: WithId<User>;
}

export const ProfileModalLinks: React.FC<ProfileModalLinksProps> = ({
  user,
}) => {
  const renderedProfileLinks = useMemo(
    () =>
      user?.profileLinks?.map((link, i) => (
        <ProfileModalLink
          containerClassName="ProfileModalLinks__link"
          link={link}
          key={`${link.title}-${link.url}`}
        />
      )),
    [user?.profileLinks]
  );

  return <div className="ProfileModalLinks">{renderedProfileLinks}</div>;
};
