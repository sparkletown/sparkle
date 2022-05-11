import React from "react";
import { MediaElement } from "components/attendee/MediaElement";
import { SpaceInfoText } from "components/attendee/SpaceInfoText";

import { DEFAULT_SHOW_CONTENT } from "settings";

import { SpaceWithId } from "types/id";

interface EmbeddableProps {
  space: SpaceWithId;
}
export const Embeddable: React.FC<EmbeddableProps> = ({ space }) => {
  const showContent = space.showContent ?? DEFAULT_SHOW_CONTENT;

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
    </>
  );
};
