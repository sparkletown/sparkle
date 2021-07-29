import { useUser } from "../../../../hooks/useUser";
import { ProfileModalLink } from "./ProfileModalLink";
import React, { useMemo } from "react";
import { ContainerClassName } from "../../../../types/utility";

interface Props extends ContainerClassName {}

export const ProfileModalLinks: React.FC<Props> = ({ containerClassName }) => {
  const { profile } = useUser();

  const renderedProfileLinks = useMemo(
    () =>
      profile?.profileLinks?.map((link) => (
        <ProfileModalLink link={link} key={link.title} />
      )),
    [profile?.profileLinks]
  );

  return <div className={containerClassName}>{renderedProfileLinks}</div>;
};
