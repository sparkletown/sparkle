import React from "react";
import { MediaElement } from "components/attendee/MediaElement";

import { AuditoriumSpaceWithId } from "types/id";

import { SeatingBlock } from "./components/SeatingBlock";

interface AuditoriumProps {
  venue: AuditoriumSpaceWithId;
}

export const Auditorium: React.FC<AuditoriumProps> = ({ venue }) => {
  return (
    <>
      {!venue.hideVideo && venue.iframeUrl && (
        <MediaElement
          url={venue.iframeUrl}
          autoPlay={venue.autoPlay || false}
        />
      )}
      <SeatingBlock space={venue} />
    </>
  );
};
