import React, { useMemo } from "react";
import { useCss } from "react-use";
import classNames from "classnames";
import { AttendeeFooter } from "components/attendee/AttendeeFooter";
import { Button } from "components/attendee/Button";
import { MainSection } from "components/attendee/MainSection";
import { MediaElement } from "components/attendee/MediaElement";

import { ALWAYS_EMPTY_ARRAY } from "settings";

import { EntranceStepTemplateProps } from "types/EntranceStep";

import { useWorldAndSpaceByParams } from "hooks/spaces/useWorldAndSpaceByParams";

import CN from "./WelcomeVideo.module.scss";

const DEFAULT_BUTTON_TEXT = "Proceed";

export const WelcomeVideo: React.FC<EntranceStepTemplateProps> = ({
  config,
  proceed,
}) => {
  const { world } = useWorldAndSpaceByParams();
  const { autoplay: autoPlay, buttons, videoUrl: url } = config;
  const hasProceedButton = !!buttons?.find(({ isProceed }) => isProceed);

  const backgroundCss = useCss({
    backgroundImage:
      world?.config.landingPageConfig.coverImageUrl &&
      `url(${world?.config.landingPageConfig.coverImageUrl})`,
  });

  const renderedButtons = useMemo(
    () =>
      (buttons ?? ALWAYS_EMPTY_ARRAY).map(
        ({ className, href, text }, index) => (
          <Button
            key={href || `${index}`}
            variant="intensive"
            className={className}
            onClick={() => (href ? window.open(href) && proceed() : proceed())}
          >
            {text ?? DEFAULT_BUTTON_TEXT}
          </Button>
        )
      ),
    [buttons, proceed]
  );

  return (
    <>
      <main data-bem="WelcomeVideo">
        <MainSection>
          <div className={classNames(CN.general, backgroundCss)}>
            <MediaElement url={url} autoPlay={autoPlay || false} />

            <div className={CN.buttonsWrapper}>
              {!hasProceedButton && (
                <Button variant="intensive" onClick={proceed}>
                  {DEFAULT_BUTTON_TEXT}
                </Button>
              )}

              {renderedButtons}
            </div>
          </div>
        </MainSection>
      </main>

      <AttendeeFooter />
    </>
  );
};
