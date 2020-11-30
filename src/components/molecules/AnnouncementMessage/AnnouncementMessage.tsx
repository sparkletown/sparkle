import React, { FC, useCallback, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";

import { getLinkFromText } from "utils/getLinkFromText";

import "./AnnouncementMessage.scss";

type AnnouncementMessageProps = {
  message?: string;
};

export const AnnouncementMessage: FC<AnnouncementMessageProps> = ({
  message = "",
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

  return (
    <div className={"announcement-container"}>
      {getLinkFromText(message)}
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
