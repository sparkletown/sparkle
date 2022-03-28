import React, { useMemo } from "react";

import { User } from "types/User";

import { WithId } from "utils/id";

import { ProfileModalLink } from "./ProfileModalLink";

export interface ProfileModalLinksProps {
  user: WithId<User>;
}

export const ProfileModalLinks: React.FC<ProfileModalLinksProps> = ({
  user,
}) => {
  const renderedProfileLinks = useMemo(
    () =>
      user?.profileLinks?.map((link, i) => (
        <ProfileModalLink link={link} key={`${link.title}-${link.url}`} />
      )),
    [user?.profileLinks]
  );

  return <div data-bem="ProfileModalLinks">{renderedProfileLinks}</div>;
};
