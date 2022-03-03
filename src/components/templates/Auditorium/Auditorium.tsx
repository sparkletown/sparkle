import React from "react";
import { MediaPlayer } from "components/attendee/MediaPlayer";
import { useBackgroundGradient } from "components/attendee/useBackgroundGradient";

import { AuditoriumVenue } from "types/venues";

import { WithId } from "utils/id";

import { SeatingBlock } from "./components/SeatingBlock";

export interface AuditoriumProps {
  venue: WithId<AuditoriumVenue>;
}

export const Auditorium: React.FC<AuditoriumProps> = ({ venue }) => {
  useBackgroundGradient();

  return (
    <>
      {!venue.hideVideo && venue.iframeUrl && (
        <MediaPlayer url={venue.iframeUrl} autoPlay={venue.autoPlay || false} />
      )}
      <SeatingBlock space={venue} />
    </>
  );
};
