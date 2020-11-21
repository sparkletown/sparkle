import React, { FC, useCallback, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";

import "./AnnouncementMessage.scss";

type AnnouncementMessageProps = {
  message?: string;
  className?: string;
};

const AnnouncementMessage: FC<AnnouncementMessageProps> = ({
  message,
  className,
}) => {
  const [announcement, setAnnouncement] = useState<string | undefined>("");
  const [isVisible, setVisibility] = useState<boolean>(false);

  const showAnnouncement = useCallback(() => {
    setVisibility(true);
  }, []);

  const hideAnnouncement = useCallback(() => {
    setVisibility(false);
  }, []);

  useEffect(() => {
    if (message !== announcement && message !== null) {
      setAnnouncement(message);
      showAnnouncement();
    }
  }, [announcement, message, showAnnouncement]);

  return (
    <>
      {isVisible && message !== null && (
        <div className={className}>
          {message}
          <span className="close-button" onClick={hideAnnouncement}>
            <FontAwesomeIcon icon={faTimesCircle} />{" "}
          </span>
        </div>
      )}
    </>
  );
};

AnnouncementMessage.defaultProps = {
  message: "",
  className: "announcement-container",
};

export default AnnouncementMessage;
