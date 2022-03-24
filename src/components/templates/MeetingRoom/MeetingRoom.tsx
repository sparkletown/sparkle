import React from "react";
import { WebcamGrid } from "components/attendee/WebcamGrid";

import { MeetingRoomVenue } from "types/venues";

import { WithId } from "utils/id";

interface MeetingRoomProps {
  space: WithId<MeetingRoomVenue>;
}
export const MeetingRoom: React.FC<MeetingRoomProps> = ({ space }) => {
  return (
    <>
      <WebcamGrid space={space} />
    </>
  );
};
