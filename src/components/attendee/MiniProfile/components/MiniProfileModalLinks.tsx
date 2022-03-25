import { useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ProfileLink } from "types/User";

import { getProfileModalLinkIcon } from "utils/profileModalLinkUtilities";
import { externalUrlAdditionalProps } from "utils/url";

import CN from "./MiniProfileModalLinks.module.scss";

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
          <a key={link.url} href={link.url} {...externalUrlAdditionalProps}>
            <FontAwesomeIcon
              className={CN.profileModalLink}
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
