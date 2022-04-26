import React from "react";
import { MediaElement } from "components/attendee/MediaElement";

import { DEFAULT_SHOW_CONTENT } from "settings";

import { AuditoriumSpaceWithId } from "types/id";

import { SeatingBlock } from "./components/SeatingBlock";

interface AuditoriumProps {
  space: AuditoriumSpaceWithId;
}

export const Auditorium: React.FC<AuditoriumProps> = ({ space }) => {
  const showContent = space.showContent ?? DEFAULT_SHOW_CONTENT;

  return (
    <>
      {showContent && space.iframeUrl && (
        <MediaElement
          url={space.iframeUrl}
          autoPlay={space.autoPlay || false}
        />
      )}
      <SeatingBlock space={space} />
    </>
  );
};
