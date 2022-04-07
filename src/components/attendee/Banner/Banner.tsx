import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Button } from "components/attendee/Button";

import { Banner as TBanner } from "types/banner";
import { SpaceId } from "types/id";

import { openUrl } from "utils/url";

import { useLiveBanner } from "hooks/spaces/useLiveBanner";
import { useShowHide } from "hooks/useShowHide";

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
  const {
    isShown: isBannerShown,
    hide: closeBanner,
    show: showBanner,
  } = useShowHide(true);

  const [bannerState, setBannerState] = useState<TBanner>();

  const space = useLiveBanner(spaceId);

  const banner = space?.banner;

  const isBannerFullScreen = banner?.isFullScreen;
  const isWithButton = banner?.buttonDisplayText && banner?.isActionButton;
  const isBannerCloaseable = !banner?.isForceFunnel;

  useEffect(() => {
    setBannerState(banner);
  }, [banner]);

  useEffect(() => {
    if (bannerState !== banner) {
      showBanner();
    }
  }, [banner, bannerState, showBanner]);

  useEffect(() => {
    if (!isBannerFullScreen) return;

    if (isBannerShown) {
      turnOnBlur();
    }
  }, [isBannerFullScreen, turnOnBlur, isBannerShown]);

  const { push: openUrlUsingRouter } = useHistory();

  const hideBanner = useCallback(() => {
    turnOffBlur();
    closeBanner();
  }, [turnOffBlur, closeBanner]);

  const navigateToBannerDestination = useCallback(() => {
    if (!banner?.buttonUrl) return;

    openUrl(banner?.buttonUrl, { customOpenRelativeUrl: openUrlUsingRouter });
  }, [openUrlUsingRouter, banner?.buttonUrl]);

  if (!isBannerFullScreen || !isBannerShown) return null;

  return (
    <div className={CN.banner}>
      <div className={CN.bannerContent}>
        <RenderMarkdown text={banner.content} />
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
