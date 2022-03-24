import React from "react";
import { RetunableMediaElement } from "components/attendee/RetunableMediaElement";
import { WebcamGrid } from "components/attendee/WebcamGrid";

import { MeetingRoomVenue } from "types/venues";

import { WithId } from "utils/id";

import styles from "./MeetingRoom.module.scss";

interface MeetingRoomProps {
  space: WithId<MeetingRoomVenue>;
}
export const MeetingRoom: React.FC<MeetingRoomProps> = ({ space }) => {
  return (
    <div className={styles.meetingRoom}>
      <RetunableMediaElement space={space} />
      <WebcamGrid space={space} />
    </div>
  );
};
