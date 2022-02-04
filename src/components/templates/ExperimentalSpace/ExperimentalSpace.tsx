import React, { useEffect } from "react";
import { useVideoComms } from "components/attendee/VideoComms/hooks";
import { VideoCommsStatus } from "components/attendee/VideoComms/VideoComms";
import { VideoCommsParticipant } from "components/attendee/VideoCommsParticipant";
import { withCurrentUserId } from "components/hocs/db/withCurrentUserId";
import { withRequired } from "components/hocs/gate/withRequired";
import { compose } from "lodash/fp";

import { ExperimentalVenue } from "types/venues";

import "./ExperimentalSpace.scss";

export interface ExperimentalSpaceProps {
  venue: ExperimentalVenue;
  userId: string;
}

const _ExperimentalSpace: React.FC<ExperimentalSpaceProps> = ({
  venue,
  userId,
}) => {
  // TODO Share this live so everyone gets it.
  /*
  useEffect(() => {
    huddle.enablePortaling()
    return () => {
      huddle.disablePortal()
    }

  }, [])
  */
  const {
    status,
    localParticipant,
    joinChannel,
    disconnect,
    remoteParticipants,
  } = useVideoComms();

  useEffect(() => {
    if (status === VideoCommsStatus.Disconnected) {
      joinChannel(userId, "Test-channel");
      /*
      setTimeout(() => {
        console.log("going for second connection");
        joinChannel(userId, "Test-channel");
      }, 10000);
      */
      return () => {
        disconnect();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/*
    {huddle.portalTrack &&
      <VideoTrack track={huddle.portalTrack} />
    }
  */}
      {localParticipant && (
        <VideoCommsParticipant participant={localParticipant} isLocal />
      )}
      {remoteParticipants.map((participant) => (
        <VideoCommsParticipant key={participant.id} participant={participant} />
      ))}
      <p>
        Experimental! {status} {localParticipant?.id} With{" "}
        {remoteParticipants.length} people
      </p>
    </>
  );
};

export const ExperimentalSpace = compose(
  withCurrentUserId,
  withRequired(["userId"])
)(_ExperimentalSpace);
