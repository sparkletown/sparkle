import React, { useCallback, useEffect, useState } from "react";

import ReactMarkdown from "react-markdown";
import glm from "remark-gfm";
import sanitize from "rehype-sanitize";

import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";

import { useChatSidebarControls } from "hooks/chatSidebar";

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
      className={classNames("announcement-container", {
        centered: !isExpanded,
      })}
    >
      <div className="announcement-message">
        <ReactMarkdown
          linkTarget={"_blank"}
          remarkPlugins={[[glm]]}
          rehypePlugins={[[sanitize]]}
        >
          {message}
        </ReactMarkdown>
      </div>
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
