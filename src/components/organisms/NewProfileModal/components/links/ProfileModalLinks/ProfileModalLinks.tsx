import { ProfileModalLink } from "components/organisms/NewProfileModal/components/links/ProfileModalLinks/ProfileModalLink/ProfileModalLink";
import React, { useMemo } from "react";
import { ContainerClassName } from "types/utility";
import { User } from "types/User";
import { WithId } from "utils/id";
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
