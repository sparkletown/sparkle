import React from "react";
import { EntranceStepConfig } from "types/EntranceStep";
import { ConvertToEmbeddableUrl } from "utils/ConvertToEmbeddableUrl";
import "./WelcomeVideo.scss";

interface PropsType {
  config: EntranceStepConfig;
  proceed: () => void;
}

export const WelcomeVideo: React.FunctionComponent<PropsType> = ({
  config,
  proceed,
}) => {
  return (
    <div className="splash-page-container">
      <div className="step-container">
        <h2>Welcome to the event! Please watch this video to get started.</h2>
        <iframe
          className="video"
          title="art-piece-video"
          src={ConvertToEmbeddableUrl(config.videoUrl, config.autoplay)}
          frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
        <button
          className="btn btn-block btn-centered btn-primary"
          onClick={proceed}
        >
          Proceed
        </button>
      </div>
    </div>
  );
};
