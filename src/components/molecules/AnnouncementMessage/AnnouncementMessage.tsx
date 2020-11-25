import React, { FC, useCallback, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";

import "./AnnouncementMessage.scss";
import { getLinkFromText } from "utils/getLinkFromText";

type AnnouncementMessageProps = {
  message?: string;
};

const AnnouncementMessage: FC<AnnouncementMessageProps> = ({
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

  return (
    <>
      {isVisible && message && (
        <div className={"announcement-container"}>
          {getLinkFromText(message)}
          <span className="close-button" onClick={hideAnnouncement}>
            <FontAwesomeIcon icon={faTimesCircle} />
          </span>
        </div>
      )}
    </>
  );
};

export default AnnouncementMessage;
