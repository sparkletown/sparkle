import { useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ProfileLink } from "types/User";

import { getProfileModalLinkIcon } from "utils/profileModalLinkUtilities";

import styles from "./MiniProfileModalLinks.module.scss";

interface MiniProfileModalLinksProps {
  profileLinks?: ProfileLink[];
}

export const MiniProfileModalLinks: React.FC<MiniProfileModalLinksProps> = ({
  profileLinks,
}) => {
  const renderedProfileModalLinks = useMemo(
    () =>
      profileLinks?.map((link: ProfileLink) => {
        const linkIcon = getProfileModalLinkIcon(link.url);

        return (
          <a key={link.url} href={link.url} target="_blank" rel="noreferrer">
            <FontAwesomeIcon
              className={styles.profileModalLink}
              icon={linkIcon}
              size="sm"
            />
          </a>
        );
      }),
    [profileLinks]
  );

  return (
    <div data-bem="MiniProfileModalLinks">{renderedProfileModalLinks}</div>
  );
};
