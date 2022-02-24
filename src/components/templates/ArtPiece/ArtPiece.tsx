import React from "react";
import classNames from "classnames";

import {
  DEFAULT_VENUE_LOGO,
  IFRAME_ALLOW,
  PORTAL_INFO_ICON_MAPPING,
} from "settings";

import { GenericVenue } from "types/venues";
import { VideoAspectRatio } from "types/VideoAspectRatio";

import { convertToEmbeddableUrl } from "utils/embeddableUrl";
import { WithId } from "utils/id";

import { VenueWithOverlay } from "components/atoms/VenueWithOverlay/VenueWithOverlay";
import { InformationCard } from "components/molecules/InformationCard";
import { Loading } from "components/molecules/Loading";
import { InformationLeftColumn } from "components/organisms/InformationLeftColumn";
import { RenderMarkdown } from "components/organisms/RenderMarkdown";
import { Room } from "components/organisms/Room";

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
  const { name, host, config, iframeUrl, videoAspect, autoPlay } = venue ?? {};

  const landingPageConfig = config?.landingPageConfig;
  const embeddableUrl = convertToEmbeddableUrl({ url: iframeUrl, autoPlay });

  // TODO-redesign - use it or delete it
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const filteredAspect = filterAspectRatioProperty(videoAspect);

  // NOTE: useful if some UI element with multiple options or free input is added for aspect ratio
  const aspectContainerClasses = classNames({
    "ArtPiece__aspect-container": true,
    "mod--sixteen-nine": videoAspect === VideoAspectRatio.sixteenNine,
    "mod--anamorphic": videoAspect === VideoAspectRatio.anamorphic,
    "mod--width-100pp":
      !videoAspect || videoAspect === VideoAspectRatio.fullWidth,
  });

  if (!venue) return <Loading label="Loading..." />;

  const infoIcon =
    host?.icon ||
    (PORTAL_INFO_ICON_MAPPING[venue.template] ?? DEFAULT_VENUE_LOGO);

  return (
    <>
      <VenueWithOverlay venue={venue} containerClassNames="ArtPiece">
        <InformationLeftColumn iconNameOrPath={infoIcon}>
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
              venueId={venue.id}
              roomName={venue.id}
              hasChairs={false}
              defaultMute={true}
            />
          </div>
        </div>
      </VenueWithOverlay>
    </>
  );
};
