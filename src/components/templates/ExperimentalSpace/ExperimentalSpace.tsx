import React, { useCallback, useEffect, useRef } from "react";
import { faArrowAltCircleUp } from "@fortawesome/free-solid-svg-icons";
import { VideoTrack } from "components/attendee/VideoComms/types";
import {
  ButtonCallbackArgs,
  useVideoHuddle,
} from "components/attendee/VideoHuddle/useVideoHuddle";
import { withCurrentUserId } from "components/hocs/db/withCurrentUserId";
import { withRequired } from "components/hocs/gate/withRequired";
import { compose } from "lodash/fp";

import { setProjectedVideoTrackId } from "api/venue";

import { ExperimentalVenue } from "types/venues";

import { WithId } from "utils/id";

import styles from "./ExperimentalSpace.module.scss";

export interface ExperimentalSpaceProps {
  venue: WithId<ExperimentalVenue>;
  userId: string;
}

interface ProjectedVideoTrackProps {
  track: VideoTrack;
}

// @debt Maybe this gets merged with VideoTrackDisplay
// Not entirely convinced they are the same though.
const ProjectedVideoTrack: React.FC<ProjectedVideoTrackProps> = ({ track }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (track && videoRef.current) {
      track.attach(videoRef.current);
      return () => {
        track.detach();
      };
    }
  }, [track]);

  return (
    <video
      ref={videoRef}
      autoPlay={true}
      className={styles.ProjectedVideoTrack}
    />
  );
};

const _ExperimentalSpace: React.FC<ExperimentalSpaceProps> = ({
  venue,
  userId,
}) => {
  // TODO Share this live so everyone gets it.

  const {
    shareScreen,
    inHuddle,
    joinHuddle,
    leaveHuddle,
    localParticipant,
    remoteParticipants,
    setExtraButtons,
  } = useVideoHuddle();

  const projectTrack = useCallback(
    ({ track }: ButtonCallbackArgs) => {
      setProjectedVideoTrackId(venue.id, track.id);
    },
    [venue.id]
  );

  useEffect(() => {
    setExtraButtons([
      {
        icon: faArrowAltCircleUp,
        callback: projectTrack,
      },
    ]);
    return () => {
      console.log("doing disconnect");
      setExtraButtons([]);
      leaveHuddle();
    };
  }, [leaveHuddle, setExtraButtons, projectTrack]);

  const disconnectCallback = useCallback(() => {
    leaveHuddle();
  }, [leaveHuddle]);
  const connectCallback = useCallback(() => {
    joinHuddle(userId, "playground-huddle");
  }, [userId, joinHuddle]);

  const shareScreenCallback = useCallback(() => {
    shareScreen();
  }, [shareScreen]);

  const allTracks = [...(localParticipant?.videoTracks || [])];
  remoteParticipants.forEach((remoteParticipant) => {
    allTracks.push(...remoteParticipant.videoTracks);
  });

  const projectedVideoTrack =
    venue.projectedVideoTrackId &&
    allTracks.find((t) => t.id === venue.projectedVideoTrackId);

  return (
    <div className={styles.Container}>
      <div>
        {inHuddle && <p onClick={disconnectCallback}>Disconnect</p>}
        {!inHuddle && <p onClick={connectCallback}>Connect</p>}
        {inHuddle && <p onClick={shareScreenCallback}>Share screen</p>}
      </div>

      <div className={styles.ContentBox}>
        {projectedVideoTrack ? (
          <ProjectedVideoTrack track={projectedVideoTrack} />
        ) : (
          <span>Select some content to project</span>
        )}
      </div>
    </div>
  );
};

export const ExperimentalSpace = compose(
  withCurrentUserId,
  withRequired(["userId"])
)(_ExperimentalSpace);
