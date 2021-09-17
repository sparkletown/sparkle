import React, { useEffect } from "react";
import classNames from "classnames";

import { Banner } from "types/banner";

import { isDefined } from "utils/types";

import { useShowHide } from "hooks/useShowHide";

import { RenderMarkdown } from "components/organisms/RenderMarkdown";

import { LinkButton } from "components/atoms/LinkButton";

import "./AnnouncementMessage.scss";

export interface AnnouncementMessageProps {
  banner: Banner | undefined;
  announcementForUser?: boolean;
}

export const AnnouncementMessage: React.FC<AnnouncementMessageProps> = ({
  banner,
  announcementForUser: isAnnouncementForUser = false,
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

  const isActiveButton =
    banner?.buttonDisplayText && banner?.buttonUrl && banner?.isActionButton;

  const isAnnouncementCloseable =
    isAnnouncementForUser && !banner?.isForceFunnel;

  const containerClasses = classNames("AnnouncementMessage__container", {
    "AnnouncementMessage__container--centered": banner?.isFullScreen,
    "AnnouncementMessage__container--admin": !isAnnouncementForUser,
  });

  const announcementMessageClasses = classNames("AnnouncementMessage", {
    "AnnouncementMessage--fullscreen":
      banner?.isFullScreen && isAnnouncementForUser,
    "AnnouncementMessage--user": isAnnouncementForUser,
  });

  const handleBannerModalClose = () => {
    if (banner?.isForceFunnel) return;

    hideAnnouncementMessage();
  };

  if (!isAnnouncementForUser && !banner?.content)
    return (
      <div className="AnnouncementMessage">
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
        {banner?.title && (
          <h2 className="AnnouncementMessage__title">{banner.title}</h2>
        )}

        <div className="AnnouncementMessage__content">
          <RenderMarkdown text={banner?.content} />
        </div>

        {isActiveButton && banner?.buttonUrl && (
          <LinkButton
            href={banner.buttonUrl}
            className="AnnouncementMessage__action-button"
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
