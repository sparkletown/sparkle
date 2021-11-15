import React from "react";

import { ALWAYS_EMPTY_ARRAY, IFRAME_ALLOW } from "settings";

import { EntranceStepTemplateProps } from "types/EntranceStep";

import { convertToEmbeddableUrl } from "utils/embeddableUrl";

import { ButtonNG } from "components/atoms/ButtonNG";

import "./WelcomeVideo.scss";

const DEFAULT_BUTTON_TEXT = "Proceed";

export const WelcomeVideo: React.FunctionComponent<EntranceStepTemplateProps> = ({
  venueName,
  config,
  proceed,
}) => {
  const { autoplay: autoPlay, buttons, videoUrl: url, welcomeText } = config;
  const hasProceedButton = !!buttons?.find(({ isProceed }) => isProceed);

  const defaultWelcomeText = `Welcome to ${venueName}! Please watch this video to get started.`;

  return (
    <div className="splash-page-container">
      <div className="step-container">
        <h2>{welcomeText ?? defaultWelcomeText}</h2>
        <iframe
          className="video"
          title="art-piece-video"
          src={convertToEmbeddableUrl({ url, autoPlay })}
          frameBorder="0"
          allow={IFRAME_ALLOW}
          allowFullScreen
        />
        {(buttons ?? ALWAYS_EMPTY_ARRAY).map(
          ({ className, href, text }, index) => (
            <ButtonNG
              key={href || `${index}`}
              variant="primary"
              className={className}
              onClick={() =>
                href ? window.open(href) && proceed() : proceed()
              }
            >
              {text ?? DEFAULT_BUTTON_TEXT}
            </ButtonNG>
          )
        )}
        {!hasProceedButton && (
          <ButtonNG variant="primary" onClick={proceed}>
            {DEFAULT_BUTTON_TEXT}
          </ButtonNG>
        )}
      </div>
    </div>
  );
};
