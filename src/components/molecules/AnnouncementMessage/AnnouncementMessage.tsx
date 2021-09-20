import React, { useEffect } from "react";
import classNames from "classnames";

import { Banner } from "types/banner";

import { isDefined } from "utils/types";

import { useShowHide } from "hooks/useShowHide";

import { RenderMarkdown } from "components/organisms/RenderMarkdown";

import { LinkButton } from "components/atoms/LinkButton";

import "./AnnouncementMessage.scss";

export interface AnnouncementMessageProps {
  banner?: Banner;
  isAnnouncementUserView?: boolean;
}

export const AnnouncementMessage: React.FC<AnnouncementMessageProps> = ({
  banner,
  isAnnouncementUserView = false,
}) => {
  const {
    isShown: isAnnouncementMessageVisible,
    show: showAnnouncementMessage,
    hide: hideAnnouncementMessage,
  } = useShowHide();

  useEffect(() => {
    if (isDefined(banner?.content)) {
      showAnnouncementMessage();
    }
  }, [banner, showAnnouncementMessage]);

  const isWithButton =
    banner?.buttonDisplayText && banner?.buttonUrl && banner?.isActionButton;

  const isAnnouncementCloseable =
    isAnnouncementUserView && !banner?.isForceFunnel;

  const containerClasses = classNames("AnnouncementMessage__container", {
    "AnnouncementMessage__container--centered": banner?.isFullScreen,
    "AnnouncementMessage__container--admin": !isAnnouncementUserView,
  });

  const announcementMessageClasses = classNames("AnnouncementMessage", {
    "AnnouncementMessage--fullscreen":
      banner?.isFullScreen && isAnnouncementUserView,
    "AnnouncementMessage--user": isAnnouncementUserView,
    "AnnouncementMessage--admin": !isAnnouncementUserView,
  });

  const actionButtonClasses = classNames("AnnouncementMessage__action-button", {
    "AnnouncementMessage__action-button-admin": !isAnnouncementUserView,
  });

  const handleBannerModalClose = () => {
    if (banner?.isForceFunnel) return;

    hideAnnouncementMessage();
  };

  if (!isAnnouncementUserView && !banner?.content)
    return (
      <div className={announcementMessageClasses}>
        <span className="AnnouncementMessage__default-text">
          No announcement
        </span>
      </div>
    );

  if (!isAnnouncementMessageVisible) return null;

  return (
    <>
      <div className={containerClasses} onClick={handleBannerModalClose} />

      <div className={announcementMessageClasses}>
        <h2 className="AnnouncementMessage__title">{banner?.title}</h2>

        <div className="AnnouncementMessage__content">
          <RenderMarkdown text={banner?.content} />
        </div>

        {isWithButton && banner?.buttonUrl && (
          <LinkButton
            href={banner?.buttonUrl}
            className={actionButtonClasses}
            onClick={hideAnnouncementMessage}
          >
            {banner?.buttonDisplayText}
          </LinkButton>
        )}

        {isAnnouncementCloseable && (
          <span
            className="AnnouncementMessage__close-button"
            onClick={hideAnnouncementMessage}
          />
        )}
      </div>
    </>
  );
};
