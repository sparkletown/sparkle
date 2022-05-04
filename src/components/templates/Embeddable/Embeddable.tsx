import React from "react";
import { MediaElement } from "components/attendee/MediaElement";

import { DEFAULT_SHOW_CONTENT } from "settings";

import { SpaceWithId } from "types/id";

import { SpaceInfoText } from "components/molecules/SpaceInfoText";

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
