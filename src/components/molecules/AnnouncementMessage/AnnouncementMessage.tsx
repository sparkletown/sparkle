import React, { useCallback, useEffect, useState } from "react";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

import { useChatSidebarControls } from "hooks/chats/chatSidebar";

import { RenderMarkdown } from "components/organisms/RenderMarkdown";

import "./AnnouncementMessage.scss";

import { BannerFormData } from "types/banner";

type AnnouncementMessageProps = {
  banner?: BannerFormData;
  isCancel?: boolean;
};

export const AnnouncementMessage: React.FC<AnnouncementMessageProps> = ({
  banner,
  isCancel = false,
}) => {
  const [isVisible, setVisibility] = useState<boolean>(false);
  const { isExpanded } = useChatSidebarControls();

  const hideAnnouncement = useCallback(() => {
    setVisibility(false);
  }, []);

  useEffect(() => {
    if (banner?.content) {
      setVisibility(true);
    }
  }, [banner]);

  if (!isVisible || !banner?.content) return null;

  return (
    <div
      aria-labelledby="announcement-container-message"
      role="dialog"
      className={classNames("announcement-container", {
        centered: !isExpanded,
      })}
    >
      <div className="announcement-message" id="announcement-container-message">
        <RenderMarkdown text={banner.content} />
      </div>
      {isCancel ? (
        <button
        aria-label="Close announcement message"
        className="close-button"
        onClick={hideAnnouncement}
        >
          <FontAwesomeIcon icon={faTimesCircle} />
        </button>
      ) : null}
    </div>
  );
};

/**
 * @deprecated use named export instead
 */
export default AnnouncementMessage;
