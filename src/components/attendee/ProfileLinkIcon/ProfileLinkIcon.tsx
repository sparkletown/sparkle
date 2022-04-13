import React, { useEffect } from "react";
import { UseFormSetValue } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { UserProfileModalFormData } from "types/profileModal";

import { useProfileModalLinkIcon } from "utils/profileModalLinkUtilities";

import CN from "./ProfileLinkIcon.module.scss";

type ProfileLinkIconProps = {
  link: string;
  index: number;
  setValue: UseFormSetValue<UserProfileModalFormData>;
};
export const ProfileLinkIcon: React.FC<ProfileLinkIconProps> = ({
  link,
  setValue,
  index,
}) => {
  const linkIcon = useProfileModalLinkIcon(link);

  useEffect(() => {
    setValue(`profileLinks.${index}.title`, linkIcon.iconName);
  }, [linkIcon, setValue, index]);

  return (
    <div className={CN.linkWrapper}>
      <FontAwesomeIcon icon={linkIcon} size="lg" />
    </div>
  );
};
