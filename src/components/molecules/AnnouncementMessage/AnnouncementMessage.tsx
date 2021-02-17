import React, { useCallback, useEffect, useState } from "react";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";

import { getLinkFromText } from "utils/getLinkFromText";

import { useChatsSidebarControls } from "hooks/useChatsSidebar";

import "./AnnouncementMessage.scss";

type AnnouncementMessageProps = {
  message?: string;
};

export const AnnouncementMessage: React.FC<AnnouncementMessageProps> = ({
  message = "",
}) => {
  const [isVisible, setVisibility] = useState<boolean>(false);
  const { isChatSidebarVisible } = useChatsSidebarControls();

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
    <div
      className={classNames("announcement-container", {
        centered: !isChatSidebarVisible,
      })}
    >
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
