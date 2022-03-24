import React from "react";
import { MediaElement } from "components/attendee/MediaElement";

import { AuditoriumVenue } from "types/venues";

import { WithId } from "utils/id";

import { SeatingBlock } from "./components/SeatingBlock";

export interface AuditoriumProps {
  venue: WithId<AuditoriumVenue>;
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
