import React, { useCallback, useEffect } from "react";
import { useVideoComms } from "components/attendee/VideoComms/hooks";
import { VideoCommsStatus } from "components/attendee/VideoComms/types";
import { VideoCommsParticipant } from "components/attendee/VideoCommsParticipant";
import { useVideoHuddle } from "components/attendee/VideoHuddle/useVideoHuddle";
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

  const { inHuddle, joinHuddle, leaveHuddle, localParticipant, remoteParticipants } = useVideoHuddle();

  useEffect(() => {
    return () => {
      console.log("doing disconnect");
      leaveHuddle();
    };
  }, [leaveHuddle]);

  const disconnectCallback = useCallback(() => {
    leaveHuddle();
  }, [leaveHuddle]);
  const connectCallback = useCallback(() => {
    joinHuddle(userId, "playground-huddle");
  }, [userId, joinHuddle]);

  return (
    <>
      <p>
        Experimental! {localParticipant?.id} With{" "}
        {remoteParticipants.length} people
      </p>
      {inHuddle && (
        <p onClick={disconnectCallback}>Disconnect!</p>
      )}
      {!inHuddle && (
        <p onClick={connectCallback}>Connect!</p>
      )}
    </>
  );
};

export const ExperimentalSpace = compose(
  withCurrentUserId,
  withRequired(["userId"])
)(_ExperimentalSpace);
