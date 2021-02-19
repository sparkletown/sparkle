import React, { useCallback, useEffect, useState } from "react";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";

import { getLinkFromText } from "utils/getLinkFromText";

import { VenueTemplate } from "types/venues";

import "./AnnouncementMessage.scss";

type AnnouncementMessageProps = {
  message?: string;
  template: VenueTemplate;
};

export const AnnouncementMessage: React.FC<AnnouncementMessageProps> = ({
  message = "",
  template,
}) => {
  const [isVisible, setVisibility] = useState<boolean>(false);

  const hideAnnouncement = useCallback(() => {
    setVisibility(false);
  }, []);

  useEffect(() => {
    if (message) {
      setVisibility(true);
    }
  }, [message]);

  if (!isVisible || !message) return null;

  const isBannerCentered = template !== VenueTemplate.partymap;

  return (
    <div
      className={classNames("announcement-container", {
        center: isBannerCentered,
      })}
    >
      <div className="announcement-message">{getLinkFromText(message)}</div>
      <span className="close-button" onClick={hideAnnouncement}>
        <FontAwesomeIcon icon={faTimesCircle} />
      </span>
    </div>
  );
};

/**
 * @deprecated use named export instead
 */
export default AnnouncementMessage;
