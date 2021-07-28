import { useUser } from "../../../../hooks/useUser";
import { ProfileModalLink } from "./ProfileModalLink";
import React, { useMemo } from "react";

export const ProfileModalLinks: React.FC = () => {
  const { profile } = useUser();

  const renderedProfileLinks = useMemo(
    () =>
      profile?.profileLinks?.map((link) => (
        <ProfileModalLink link={link} key={link.title} />
      )),
    [profile?.profileLinks]
  );

  return <>{renderedProfileLinks}</>;
};
