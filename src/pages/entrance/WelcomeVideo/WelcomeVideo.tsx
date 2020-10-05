import React from "react";
import { EntranceStepConfig } from "types/EntranceStep";
import { ConvertToEmbeddableUrl } from "utils/ConvertToEmbeddableUrl";
import "./WelcomeVideo.scss";

interface PropsType {
  venueName: string;
  config: EntranceStepConfig;
  proceed: () => void;
}

const DEFAULT_BUTTON_TEXT = "Proceed";

export const WelcomeVideo: React.FunctionComponent<PropsType> = ({
  venueName,
  config,
  proceed,
}) => {
  const hasProceedButton =
    config.buttons && config.buttons.find((button) => button.isProceed);

  const defaultWelcomeText = `Welcome to ${venueName}! Please watch this video to get started.`;

  return (
    <div className="splash-page-container">
      <div className="step-container">
        <h2>{config.welcomeText ?? defaultWelcomeText}</h2>
        <iframe
          className="video"
          title="art-piece-video"
          src={ConvertToEmbeddableUrl(config.videoUrl, config.autoplay)}
          frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
        {config.buttons &&
          config.buttons.map((button) => (
            <button
              className={`btn btn-block btn-centered btn-primary ${button.className}`}
              onClick={() =>
                button.href ? window.open(button.href) && proceed() : proceed()
              }
            >
              {button.text ?? DEFAULT_BUTTON_TEXT}
            </button>
          ))}
        {!hasProceedButton && (
          <button
            className="btn btn-block btn-centered btn-primary"
            onClick={proceed}
          >
            {DEFAULT_BUTTON_TEXT}
          </button>
        )}
      </div>
    </div>
  );
};
