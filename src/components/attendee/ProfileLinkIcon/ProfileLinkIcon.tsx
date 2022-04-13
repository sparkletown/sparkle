import React, { useEffect } from "react";
import { UseFormSetValue } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { UserProfileModalFormData } from "types/profileModal";

import { useProfileModalLinkIcon } from "utils/profileModalLinkUtilities";

import styles from "./ProfileLinkIcon.module.scss";

type ProfileLinkIconProps = {
  link: string;
  index: number;
  setLinkIcon: UseFormSetValue<UserProfileModalFormData>;
};
export const ProfileLinkIcon: React.FC<ProfileLinkIconProps> = ({
  link,
  setLinkIcon,
  index,
}) => {
  const linkIcon = useProfileModalLinkIcon(link);

  useEffect(() => {
    setLinkIcon(`profileLinks.${index}.title`, linkIcon.iconName);
  }, [linkIcon, setLinkIcon, index]);

  return (
    <div className={styles.linkWrapper}>
      <FontAwesomeIcon icon={linkIcon} size="lg" />
    </div>
  );
};
