import React from "react";
import { MediaElement } from "components/attendee/MediaElement";

import { SpaceWithId } from "types/id";

import { SpaceInfoText } from "components/molecules/SpaceInfoText";

interface EmbeddableProps {
  space: SpaceWithId;
}
export const Embeddable: React.FC<EmbeddableProps> = ({ space }) => {
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
    </>
  );
};
