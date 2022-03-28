import React, { useCallback, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Button } from "components/attendee/Button";

import { Banner as TBanner } from "types/banner";

import { openUrl } from "utils/url";

import { useShowHide } from "hooks/useShowHide";

import { RenderMarkdown } from "components/organisms/RenderMarkdown";

import CN from "./Banner.module.scss";

export type BannerProps = {
  banner: TBanner;
  turnOnBlur: () => void;
  turnOffBlur: () => void;
};

export const Banner: React.FC<BannerProps> = ({
  banner,
  turnOnBlur,
  turnOffBlur,
}) => {
  const { isShown: isBannerShown, hide: closeBanner } = useShowHide(true);

  const isBannerFullScreen = banner.isFullScreen;
  const isWithButton = banner?.buttonDisplayText && banner?.isActionButton;
  const isBannerCloaseable = !banner?.isForceFunnel;

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

  const goToButtonDestination = useCallback(() => {
    if (!banner.buttonUrl) return;

    openUrl(banner.buttonUrl, { customOpenRelativeUrl: openUrlUsingRouter });
  }, [openUrlUsingRouter, banner.buttonUrl]);

  if (!isBannerFullScreen || !isBannerShown) return null;

  return (
    <div className={CN.banner}>
      <div className={CN.bannerContent}>
        <RenderMarkdown text={banner.content} />
        <div className={CN.actionButtons}>
          {isWithButton && banner.buttonUrl && (
            <Button onClick={goToButtonDestination}>
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
