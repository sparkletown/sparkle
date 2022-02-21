import React, { useCallback, useEffect, useMemo } from "react";
import {
  Participant,
  VideoSource,
  VideoTrack,
} from "components/attendee/VideoComms/types";
import { VideoTrackDisplay } from "components/attendee/VideoComms/VideoTrackDisplay";
import { useVideoHuddle } from "components/attendee/VideoHuddle/useVideoHuddle";
import { withCurrentUserId } from "components/hocs/db/withCurrentUserId";
import { withRequired } from "components/hocs/gate/withRequired";
import { compose } from "lodash/fp";

import { setProjectedVideoTrackId } from "api/venue";

import { UserId } from "types/id";
import { ExperimentalVenue } from "types/venues";

import { WithId } from "utils/id";

import { useProfileById } from "hooks/user/useProfileById";

import { Dropdown } from "components/atoms/Dropdown";

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
  return (
    <div className={styles.projectedVideoTrack}>
      <VideoTrackDisplay track={track} />
    </div>
  );
};

interface UserTracknameProps {
  track: VideoTrack;
  participant: Participant;
}
const UserTrackname: React.FC<UserTracknameProps> = ({
  track,
  participant,
}) => {
  const { profile, isLoading } = useProfileById({
    userId: participant.sparkleId as UserId,
  });

  if (isLoading || !profile) {
    // Don't display an option whilst the profile is loading
    return null;
  }

  if (track.sourceType === VideoSource.Webcam) {
    return <span>{profile.partyName}&apos;s webcam</span>;
  }

  if (track.sourceType === VideoSource.Screenshare) {
    return <span>{profile.partyName}&apos;s screen</span>;
  }
  return null;
};

const _ExperimentalSpace: React.FC<ExperimentalSpaceProps> = ({
  venue,
  userId,
}) => {
  const {
    shareScreen,
    inHuddle,
    joinHuddle,
    leaveHuddle,
    localParticipant,
    remoteParticipants,
  } = useVideoHuddle();

  useEffect(() => {
    return () => {
      leaveHuddle();
    };
  }, [leaveHuddle]);

  const disconnectCallback = useCallback(() => {
    leaveHuddle();
  }, [leaveHuddle]);
  const connectCallback = useCallback(() => {
    joinHuddle(userId, "playground-huddle");
  }, [userId, joinHuddle]);

  const shareScreenCallback = useCallback(() => {
    shareScreen();
  }, [shareScreen]);

  const allTracks = useMemo(() => {
    const result = [
      ...(localParticipant?.videoTracks?.map((t) => ({
        participant: localParticipant,
        track: t,
      })) || []),
    ];
    remoteParticipants.forEach((remoteParticipant) => {
      result.push(
        ...remoteParticipant.videoTracks.map((t) => ({
          participant: remoteParticipant,
          track: t,
        }))
      );
    });
    return result;
  }, [localParticipant, remoteParticipants]);

  const projectedVideoTrack = useMemo(() => {
    const foundTrackParticipantPair = venue.projectedVideoTrackId
      ? allTracks.find(({ track }) => track.id === venue.projectedVideoTrackId)
      : undefined;
    if (foundTrackParticipantPair) {
      return foundTrackParticipantPair.track;
    }
    return undefined;
  }, [allTracks, venue.projectedVideoTrackId]);

  const trackOptions = useMemo(() => {
    return (
      <>
        <div onClick={() => setProjectedVideoTrackId(venue.id, null)}>
          Nothing
        </div>
        {allTracks.map(({ track, participant }) => (
          <div
            key={track.id}
            onClick={() => {
              setProjectedVideoTrackId(venue.id, track.id);
            }}
          >
            <UserTrackname participant={participant} track={track} />
          </div>
        ))}
      </>
    );
  }, [allTracks, venue.id]);

  const projectTitle = useMemo(
    () => <span>Choose a track to project</span>,
    []
  );

  return (
    <div className={styles.container}>
      <div>
        {inHuddle && <p onClick={disconnectCallback}>Disconnect</p>}
        {!inHuddle && <p onClick={connectCallback}>Connect</p>}
        {inHuddle && <p onClick={shareScreenCallback}>Share screen</p>}
      </div>
      <Dropdown title={projectTitle}>{trackOptions}</Dropdown>
      <div className={styles.contentBox}>
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
