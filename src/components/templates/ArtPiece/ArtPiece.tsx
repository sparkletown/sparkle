import React from "react";

import { IFRAME_ALLOW } from "settings";

import { VideoAspectRatio } from "types/VideoAspectRatio";

import { ConvertToEmbeddableUrl } from "utils/ConvertToEmbeddableUrl";
import { currentVenueSelectorData } from "utils/selectors";

import { useSelector } from "hooks/useSelector";

import Room from "components/organisms/Room";
import WithNavigationBar from "components/organisms/WithNavigationBar";
import { InformationLeftColumn } from "components/organisms/InformationLeftColumn";
import InformationCard from "components/molecules/InformationCard";
import SparkleFairiesPopUp from "components/molecules/SparkleFairiesPopUp/SparkleFairiesPopUp";

import "./ArtPiece.scss";

export const ArtPiece = () => {
  const venue = useSelector(currentVenueSelectorData);

  if (!venue) return <>Loading...</>;

  const iframeUrl = ConvertToEmbeddableUrl(venue.iframeUrl);

  const aspectContainerClasses = `aspect-container ${
    venue.videoAspect === VideoAspectRatio.SixteenNine ? "aspect-16-9" : ""
  }`;

  return (
    <WithNavigationBar>
      <div className="full-page-container art-piece-container">
        <InformationLeftColumn iconNameOrPath={venue?.host?.icon}>
          <InformationCard title="About the venue">
            <p className="title-sidebar">{venue.name}</p>
            <p className="short-description-sidebar" style={{ fontSize: 18 }}>
              {venue.config?.landingPageConfig.subtitle}
            </p>
            <p style={{ fontSize: 13 }}>
              {venue.config?.landingPageConfig.description}
            </p>
          </InformationCard>
        </InformationLeftColumn>
        <div className="content">
          <div className={aspectContainerClasses}>
            <iframe
              className="youtube-video"
              title="art-piece-video"
              src={iframeUrl}
              frameBorder="0"
              allow={IFRAME_ALLOW}
              allowFullScreen
            />
          </div>
          <div className="video-chat-wrapper">
            <Room
              venueName={venue.name}
              roomName={venue.name}
              setUserList={() => null}
              hasChairs={false}
              defaultMute={true}
            />
          </div>
        </div>
      </div>
      {venue?.showRangers && (
        <div className="sparkle-fairies">
          <SparkleFairiesPopUp />
        </div>
      )}
    </WithNavigationBar>
  );
};
