import React, { useEffect } from "react";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

import { isDefined } from "utils/types";

import { useWorldAndSpaceByParams } from "hooks/spaces/useWorldAndSpaceByParams";
import { useShowHide } from "hooks/useShowHide";

import { LinkButton } from "components/atoms/LinkButton";
import { RenderMarkdown } from "components/organisms/RenderMarkdown";

export interface AnnouncementMessageProps {
  isAnnouncementUserView?: boolean;
}

export const AnnouncementMessage: React.FC<AnnouncementMessageProps> = ({
  isAnnouncementUserView = false,
}) => {
  const {
    isShown: isAnnouncementMessageShown,
    show: showAnnouncementMessage,
    hide: hideAnnouncementMessage,
  } = useShowHide();

  const { space } = useWorldAndSpaceByParams();

  const { banner } = space ?? {};

  useEffect(() => {
    if (isDefined(banner?.content)) {
      showAnnouncementMessage();
    }
  }, [banner, showAnnouncementMessage]);

  const isWithButton = banner?.buttonDisplayText && banner?.isActionButton;

  const isAnnouncementCloseable = !banner?.isForceFunnel;

  const containerClasses = classNames("AnnouncementMessage__container", {
    "AnnouncementMessage__container--centered": banner?.isFullScreen,
    "AnnouncementMessage__container--admin": !isAnnouncementUserView,
    "AnnouncementMessage__container--withButton": isWithButton,
  });

  const announcementMessageClasses = classNames("AnnouncementMessage", {
    AnnouncementMessage__fullscreen: banner?.isFullScreen,
    AnnouncementMessage__admin: !isAnnouncementUserView,
    "AnnouncementMessage__fullscreen--admin":
      banner?.isFullScreen && !isAnnouncementUserView,
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

  if (!banner?.content || !isAnnouncementMessageShown) return null;

  return (
    <>
      <div className={containerClasses} onClick={handleBannerModalClose}>
        <div className={announcementMessageClasses}>
          <div className="AnnouncementMessage__content">
            <RenderMarkdown text={banner.content} />
          </div>

          {isWithButton && banner.buttonUrl && (
            <LinkButton
              href={banner.buttonUrl}
              className={actionButtonClasses}
              onClick={hideAnnouncementMessage}
            >
              {banner.buttonDisplayText}
            </LinkButton>
          )}

          {isAnnouncementCloseable && (
            <FontAwesomeIcon
              className="AnnouncementMessage__close-button"
              icon={faTimes}
              onClick={handleBannerModalClose}
            />
          )}
        </div>
      </div>
    </>
  );
};
