import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Button } from "components/attendee/Button";
import { isEmpty, isEqual } from "lodash";

import { Banner as TBanner } from "types/banner";
import { SpaceId } from "types/id";

import { openUrl } from "utils/url";

import { useLiveSpace } from "hooks/spaces/useLiveSpace";
import { useShowHide } from "hooks/useShowHide";
import { useDisableBodyScroll } from "hooks/viewport/useDisableBodyScroll";

import { RenderMarkdown } from "components/organisms/RenderMarkdown";

import CN from "./Banner.module.scss";

export type BannerProps = {
  spaceId: SpaceId;
  turnOnBlur: () => void;
  turnOffBlur: () => void;
};

export const Banner: React.FC<BannerProps> = ({
  spaceId,
  turnOnBlur,
  turnOffBlur,
}) => {
  const space = useLiveSpace(spaceId);

  const banner = space?.banner;
  const isBannerLive = !isEmpty(banner);

  const {
    isShown: isBannerShown,
    hide: closeBanner,
    show: showBanner,
  } = useShowHide(isBannerLive);

  const [bannerState, setBannerState] = useState<TBanner>();

  // @debt use banner?.isFullScreen property once we have designs for non-fullscreen banners;
  // otherwise scrolling logic on mobile breaks
  // const isBannerFullScreen = banner?.isFullScreen;
  const isBannerFullScreen = true;

  const isWithButton = banner?.buttonDisplayText && banner?.isActionButton;
  const isBannerCloaseable = !banner?.isForceFunnel;

  useEffect(() => {
    setBannerState(banner);
  }, [banner]);

  useEffect(() => {
    if (!isEqual(bannerState, banner) && isBannerLive) {
      showBanner();
    }
  }, [banner, bannerState, showBanner, turnOnBlur, isBannerLive]);

  useEffect(() => {
    if (!isBannerFullScreen) return;

    if (isBannerShown) {
      turnOnBlur();
    }
  }, [isBannerFullScreen, turnOnBlur, isBannerShown]);

  // Hide body scroll.
  useDisableBodyScroll({ isOpen: isBannerShown });

  const { push: openUrlUsingRouter } = useHistory();

  const hideBanner = useCallback(() => {
    turnOffBlur();
    closeBanner();
  }, [turnOffBlur, closeBanner]);

  const navigateToBannerDestination = useCallback(() => {
    if (!banner?.buttonUrl) return;

    openUrl(banner?.buttonUrl, { customOpenRelativeUrl: openUrlUsingRouter });
  }, [openUrlUsingRouter, banner?.buttonUrl]);

  if (!isBannerShown) return null;

  return (
    <div className={CN.banner}>
      <div className={CN.bannerContent}>
        <RenderMarkdown text={banner?.content} />
        <div className={CN.actionButtons}>
          {isWithButton && banner.buttonUrl && (
            <Button onClick={navigateToBannerDestination}>
              {banner.buttonDisplayText}
            </Button>
          )}

          {isBannerCloaseable && (
            <Button
              className={CN.closeButton}
              onClick={hideBanner}
              variant="alternative"
            >
              Close
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
