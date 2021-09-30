import React from "react";
import { useCss } from "react-use";
import classNames from "classnames";

import { IFRAME_ALLOW } from "settings";

import { ViewingWindowVenue } from "types/venues";
import { VideoAspectRatio } from "types/VideoAspectRatio";

import { convertToEmbeddableUrl } from "utils/embeddableUrl";
import { WithId } from "utils/id";

import { InformationLeftColumn } from "components/organisms/InformationLeftColumn";
import { RenderMarkdown } from "components/organisms/RenderMarkdown";
import Room from "components/organisms/Room";

import InformationCard from "components/molecules/InformationCard";
import { Loading } from "components/molecules/Loading";

import { VenueWithOverlay } from "components/atoms/VenueWithOverlay/VenueWithOverlay";

import "./ViewingWindow.scss";

const DECLARATIVE_ASPECT_RATIOS = [
  `${VideoAspectRatio.sixteenNine}`,
  `${VideoAspectRatio.anamorphic}`,
  `${VideoAspectRatio.fullWidth}`,
];

const filterAspectRatioProperty: (candidate?: string) => string = (candidate) =>
  candidate && !DECLARATIVE_ASPECT_RATIOS.includes(candidate) ? candidate : "";

export interface ViewingWindowProps {
  venue: WithId<ViewingWindowVenue>;
}

export const ViewingWindow: React.FC<ViewingWindowProps> = ({ venue }) => {
  // NOTE: venue should always be there, but per the if(!venue) check bellow, better make safe than sorry
  const { name, host, config, iframeUrl, videoAspect, isWithParticipants } =
    venue ?? {};

  const landingPageConfig = config?.landingPageConfig;
  const embeddableUrl = convertToEmbeddableUrl({ url: iframeUrl });

  const filteredAspect = filterAspectRatioProperty(videoAspect);
  const customAspect = useCss({
    "aspect-ratio": filteredAspect,
  });

  // NOTE: useful if some UI element with multiple options or free input is added for aspect ratio
  const aspectContainerClasses = classNames({
    "ViewingWindow__aspect-container": true,
    "mod--sixteen-nine": videoAspect === VideoAspectRatio.sixteenNine,
    "mod--anamorphic": videoAspect === VideoAspectRatio.anamorphic,
    "mod--width-100pp":
      !videoAspect || videoAspect === VideoAspectRatio.fullWidth,
    [customAspect]: true,
  });

  if (!venue) return <Loading label="Loading..." />;

  return (
    <>
      <VenueWithOverlay venue={venue} containerClassNames="ViewingWindow">
        <InformationLeftColumn iconNameOrPath={host?.icon}>
          <InformationCard title="About the venue">
            <p className="ViewingWindow__title-sidebar">{name}</p>
            <p className="ViewingWindow__short-description-sidebar">
              {landingPageConfig?.subtitle}
            </p>
            <div className="ViewingWindow__rendered-markdown">
              <RenderMarkdown text={landingPageConfig?.description} />
            </div>
          </InformationCard>
        </InformationLeftColumn>
        <div className="ViewingWindow__content">
          <div className={aspectContainerClasses}>
            <iframe
              className="ViewingWindow__youtube-video"
              title="art-piece-video"
              src={embeddableUrl}
              frameBorder="0"
              allow={IFRAME_ALLOW}
              allowFullScreen
            />
          </div>
          {isWithParticipants && (
            <div className="ViewingWindow__video-chat-wrapper">
              <Room
                venueId={venue.id}
                roomName={name}
                hasChairs={false}
                defaultMute={true}
              />
            </div>
          )}
        </div>
      </VenueWithOverlay>
    </>
  );
};
