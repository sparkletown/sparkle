import React, { useCallback, useEffect, useState } from "react";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";

import { useChatSidebarControls } from "hooks/chatSidebar";

import { RenderMarkdown } from "components/organisms/RenderMarkdown";

import "./AnnouncementMessage.scss";

type AnnouncementMessageProps = {
  message?: string;
};

export const AnnouncementMessage: React.FC<AnnouncementMessageProps> = ({
  message = "",
}) => {
  const [isVisible, setVisibility] = useState<boolean>(false);
  const { isExpanded } = useChatSidebarControls();

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
      role="dialog"
      className={classNames("announcement-container", {
        centered: !isExpanded,
      })}
    >
      <div className="announcement-message">
        <RenderMarkdown text={message} />
      </div>
      <button
        aria-label="Close announcement message"
        className="close-button no-outline-on-focus"
        onClick={hideAnnouncement}
      >
        <FontAwesomeIcon icon={faTimesCircle} />
      </button>
    </div>
  );
};

/**
 * @deprecated use named export instead
 */
export default AnnouncementMessage;
