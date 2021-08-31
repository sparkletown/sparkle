import React from "react";
import classNames from "classnames";

import { IFRAME_ALLOW } from "settings";

import { GenericVenue } from "types/venues";
import { VideoAspectRatio } from "types/VideoAspectRatio";

import { ConvertToEmbeddableUrl } from "utils/ConvertToEmbeddableUrl";
import { WithId } from "utils/id";

import { InformationLeftColumn } from "components/organisms/InformationLeftColumn";
import { RenderMarkdown } from "components/organisms/RenderMarkdown";
import Room from "components/organisms/Room";

import InformationCard from "components/molecules/InformationCard";
import { Loading } from "components/molecules/Loading";
import SparkleFairiesPopUp from "components/molecules/SparkleFairiesPopUp/SparkleFairiesPopUp";

import "./ArtPiece.scss";

export interface ArtPieceProps {
  venue: WithId<GenericVenue>;
}

export const ArtPiece: React.FC<ArtPieceProps> = ({ venue }) => {
  if (!venue) return <Loading label="Loading..." />;

  const { name, host, config, showRangers, iframeUrl, videoAspect } = venue;
  const landingPageConfig = config?.landingPageConfig;
  const embeddableUrl = ConvertToEmbeddableUrl(iframeUrl);

  const aspectContainerClasses = classNames({
    "ArtPiece__aspect-container": true,
    "mod--sixteen-nine": videoAspect === VideoAspectRatio.SixteenNine,
    "mod--anamorphic": videoAspect !== VideoAspectRatio.SixteenNine,
  });

  return (
    <div className="ArtPiece">
      <InformationLeftColumn iconNameOrPath={host?.icon}>
        <InformationCard title="About the venue">
          <p className="ArtPiece__title-sidebar">{name}</p>
          <p className="ArtPiece__short-description-sidebar">
            {landingPageConfig?.subtitle}
          </p>
          <div className="ArtPiece__rendered-markdown">
            <RenderMarkdown text={landingPageConfig?.description} />
          </div>
        </InformationCard>
      </InformationLeftColumn>
      <div className="ArtPiece__content">
        <div className={aspectContainerClasses}>
          <iframe
            className="ArtPiece__youtube-video"
            title="art-piece-video"
            src={embeddableUrl}
            frameBorder="0"
            allow={IFRAME_ALLOW}
            allowFullScreen
          />
        </div>
        <div className="ArtPiece__video-chat-wrapper">
          <Room
            venueName={name}
            roomName={name}
            setUserList={() => null}
            hasChairs={false}
            defaultMute={true}
          />
        </div>
      </div>
      {showRangers && (
        <div className="ArtPiece__sparkle-fairies">
          <SparkleFairiesPopUp />
        </div>
      )}
    </div>
  );
};
