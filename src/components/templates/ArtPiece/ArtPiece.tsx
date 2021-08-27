import React from "react";

import { IFRAME_ALLOW } from "settings";

import { GenericVenue } from "types/venues";
import { VideoAspectRatio } from "types/VideoAspectRatio";

import { ConvertToEmbeddableUrl } from "utils/ConvertToEmbeddableUrl";
import { WithId } from "utils/id";

import Room from "components/organisms/Room";

import { Loading } from "components/molecules/Loading";
import SparkleFairiesPopUp from "components/molecules/SparkleFairiesPopUp/SparkleFairiesPopUp";

import "./ArtPiece.scss";

export interface ArtPieceProps {
  venue: WithId<GenericVenue>;
}

export const ArtPiece: React.FC<ArtPieceProps> = ({ venue }) => {
  if (!venue) return <Loading label="Loading..." />;

  const iframeUrl = ConvertToEmbeddableUrl(venue.iframeUrl);

  const aspectContainerClasses = `aspect-container ${
    venue.videoAspect === VideoAspectRatio.SixteenNine ? "aspect-16-9" : ""
  }`;

  return (
    <>
      <div className="full-page-container art-piece-container">
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
    </>
  );
};
