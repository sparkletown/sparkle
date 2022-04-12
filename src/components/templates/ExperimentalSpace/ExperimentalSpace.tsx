import React, { useCallback, useEffect, useMemo } from "react";
import { Dropdown } from "components/admin/Dropdown";
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

import { COLLECTION_EXPERIMENTS } from "settings";

import { setProjectedVideoTrackId } from "api/experiments";

import { ExperimentalSpaceWithId, UserId } from "types/id";

import { createErrorCapture } from "utils/error";

import { useRefiDocument } from "hooks/fire/useRefiDocument";
import { useProfileById } from "hooks/user/useProfileById";

import styles from "./ExperimentalSpace.module.scss";

export interface ExperimentalSpaceProps {
  venue: ExperimentalSpaceWithId;
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

interface ProjectionData {
  projectedVideoTrackId: string | null;
}

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

  const huddleId = useMemo(() => `playground-huddle-${venue.id}`, [venue.id]);

  const queryPath = useMemo(
    () => [COLLECTION_EXPERIMENTS, `projection-${huddleId}`],
    [huddleId]
  );

  const { data: projectionData } = useRefiDocument<ProjectionData>(queryPath);

  useEffect(() => {
    return () => {
      leaveHuddle();
    };
  }, [leaveHuddle]);

  const disconnectCallback = useCallback(() => {
    leaveHuddle();
  }, [leaveHuddle]);
  const connectCallback = useCallback(() => {
    joinHuddle(userId, `playground-huddle-${venue.id}`);
  }, [joinHuddle, userId, venue.id]);

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
    const foundTrackParticipantPair = projectionData?.projectedVideoTrackId
      ? allTracks.find(
          ({ track }) => track.id === projectionData?.projectedVideoTrackId
        )
      : undefined;
    if (foundTrackParticipantPair) {
      return foundTrackParticipantPair.track;
    }
    return undefined;
  }, [allTracks, projectionData?.projectedVideoTrackId]);

  const trackOptions = useMemo(() => {
    return (
      <>
        <div
          onClick={() =>
            setProjectedVideoTrackId(huddleId, null).catch(
              createErrorCapture({
                message: "Problem clearing projected video track id",
                where: "ExperimentalSpace",
                args: { huddleId },
              })
            )
          }
        >
          Nothing
        </div>
        {allTracks.map(({ track, participant }) => {
          const trackId = track.id;
          return (
            <div
              key={trackId}
              onClick={() =>
                setProjectedVideoTrackId(huddleId, trackId).catch(
                  createErrorCapture({
                    message: "Unable to set projected video track id",
                    where: "ExperimentalSpace",
                    args: { huddleId, trackId },
                  })
                )
              }
            >
              <UserTrackname participant={participant} track={track} />
            </div>
          );
        })}
      </>
    );
  }, [allTracks, huddleId]);

  const projectTitle = useMemo(
    () => <span>Choose a track to project</span>,
    []
  );

  return (
    <div
      data-bem="ExperimentalSpace"
      data-block="ExperimentalSpace"
      data-side="att"
      className={styles.container}
    >
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
