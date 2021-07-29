import { useUser } from "../../../../hooks/useUser";
import { ProfileModalLink } from "./ProfileModalLink";
import React, { useMemo } from "react";

interface Props {
  className?: string;
}

export const ProfileModalLinks: React.FC<Props> = ({ className }) => {
  const { profile } = useUser();

  const renderedProfileLinks = useMemo(
    () =>
      profile?.profileLinks?.map((link) => (
        <ProfileModalLink link={link} key={link.title} />
      )),
    [profile?.profileLinks]
  );

  return <div className={className}>{renderedProfileLinks}</div>;
};
