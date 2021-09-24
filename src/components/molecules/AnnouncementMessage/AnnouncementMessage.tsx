import React, { useEffect } from "react";
import classNames from "classnames";

import { isDefined } from "utils/types";

import { useConnectCurrentVenueNG } from "hooks/useConnectCurrentVenueNG";
import { useShowHide } from "hooks/useShowHide";
import { useVenueId } from "hooks/useVenueId";

import { RenderMarkdown } from "components/organisms/RenderMarkdown";

import { LinkButton } from "components/atoms/LinkButton";

import "./AnnouncementMessage.scss";

export interface AnnouncementMessageProps {
  isAnnouncementUserView?: boolean;
}

export const AnnouncementMessage: React.FC<AnnouncementMessageProps> = ({
  isAnnouncementUserView = false,
}) => {
  const {
    isShown,
    show: showAnnouncementMessage,
    hide: hideAnnouncementMessage,
  } = useShowHide();

  const venueId = useVenueId();
  const { currentVenue: venue } = useConnectCurrentVenueNG(venueId);

  const { banner } = venue ?? {};

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
    "AnnouncementMessage__fullscreen--admin":
      banner?.isFullScreen && !isAnnouncementUserView,
  });

  const actionButtonClasses = classNames("AnnouncementMessage__action-button", {
    "AnnouncementMessage__action-button-admin": !isAnnouncementUserView,
  });

  const handleBannerModalClose = () => {
    if (banner?.isForceFunnel) return;
    console.log("????");
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

  if (!banner?.content || !isShown) return null;

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
            <span
              className="AnnouncementMessage__close-button"
              onClick={handleBannerModalClose}
            />
          )}
        </div>
      </div>
    </>
  );
};
