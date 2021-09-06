import React from "react";
import { useCss } from "react-use";
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

const DECLARATIVE_ASPECT_RATIOS = [
  `${VideoAspectRatio.sixteenNine}`,
  `${VideoAspectRatio.anamorphic}`,
  `${VideoAspectRatio.fullWidth}`,
];

const filterAspectRatioProperty: (candidate?: string) => string = (candidate) =>
  candidate && !DECLARATIVE_ASPECT_RATIOS.includes(candidate) ? candidate : "";

export interface ArtPieceProps {
  venue: WithId<GenericVenue>;
}

export const ArtPiece: React.FC<ArtPieceProps> = ({ venue }) => {
  // NOTE: venue should always be there, but per the if(!venue) check bellow, better make safe than sorry
  const { name, host, config, showRangers, iframeUrl, videoAspect } =
    venue ?? {};

  const landingPageConfig = config?.landingPageConfig;
  const embeddableUrl = ConvertToEmbeddableUrl(iframeUrl);

  const filteredAspect = filterAspectRatioProperty(videoAspect);
  const customAspect = useCss({
    "aspect-ratio": filteredAspect,
  });

  // NOTE: useful if some UI element with multiple options or free input is added for aspect ratio
  const aspectContainerClasses = classNames({
    "ArtPiece__aspect-container": true,
    "mod--sixteen-nine": videoAspect === VideoAspectRatio.sixteenNine,
    "mod--anamorphic": videoAspect === VideoAspectRatio.anamorphic,
    "mod--width-100pp":
      !videoAspect || videoAspect === VideoAspectRatio.fullWidth,
    [customAspect]: true,
  });

  if (!venue) return <Loading label="Loading..." />;

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
