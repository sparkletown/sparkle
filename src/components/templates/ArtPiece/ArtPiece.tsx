import React, { useEffect } from "react";
import { MediaElement } from "components/attendee/MediaElement";
import { WebcamGrid } from "components/attendee/WebcamGrid";

import { DEFAULT_SHOW_CONTENT } from "settings";

import { ArtPieceSpaceWithId } from "types/id";

import { useAnalytics } from "hooks/useAnalytics";

import { SpaceInfoText } from "components/molecules/SpaceInfoText";

interface ArtPieceProps {
  space: ArtPieceSpaceWithId;
}

export const ArtPiece: React.FC<ArtPieceProps> = ({ space }) => {
  const analytics = useAnalytics({ venue: space });

  const showContent = space.showContent ?? DEFAULT_SHOW_CONTENT;

  useEffect(() => {
    analytics.trackEnterJazzBarEvent();
  }, [analytics]);

  return (
    <>
      {showContent && (
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
