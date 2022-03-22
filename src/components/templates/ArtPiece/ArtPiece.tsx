import React, { useEffect } from "react";
import { MediaElement } from "components/attendee/MediaElement";
import { WebcamGrid } from "components/attendee/WebcamGrid";

import { ArtPieceVenue } from "types/venues";

import { WithId } from "utils/id";

import { useAnalytics } from "hooks/useAnalytics";

import { SpaceInfoText } from "components/molecules/SpaceInfoText";

interface ArtPieceProps {
  space: WithId<ArtPieceVenue>;
}
export const ArtPiece: React.FC<ArtPieceProps> = ({ space }) => {
  const analytics = useAnalytics({ venue: space });

  useEffect(() => {
    analytics.trackEnterJazzBarEvent();
  }, [analytics]);

  return (
    <>
      {!space.hideVideo && (
        <MediaElement
          url={space.iframeUrl}
          autoPlay={space.autoPlay || false}
          fullWidth
        />
      )}

      <SpaceInfoText space={space} />
      <WebcamGrid space={space} />
    </>
  );
};
