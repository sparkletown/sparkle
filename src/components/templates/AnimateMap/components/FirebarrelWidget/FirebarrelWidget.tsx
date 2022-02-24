import React, { useCallback, useMemo } from "react";

import { User } from "types/User";
import { AnimateMapVenue } from "types/venues";

import { useVideoRoomState } from "hooks/twilio/useVideoRoomState";
import { useUser } from "hooks/useUser";

import { ButtonOG } from "components/atoms/ButtonOG";
import { VideoCommsParticipant } from "components/attendee/VideoComms/VideoCommsParticipant";

import "./FirebarrelWidget.scss";

const NUM_OF_SIDED_USERS_MINUS_ONE = 3;

export interface FirebarrelWidgetProps {
  venue: AnimateMapVenue;
  roomName: string;
  onEnter: (roomId: string, val: User[]) => void;
  onExit: (roomId: string) => void;
  setUserList: (roomId: string, val: User[]) => void;
  onBack?: () => void;
  hasChairs?: boolean;
  defaultMute?: boolean;
  isAudioEffectDisabled: boolean;
}

// @debt THIS COMPONENT IS THE COPY OF components/molecules/TableComponent
// The reason to copy it was the lack of time to refactor the whole thing, so the
// safest approch (not to break other Venues that rely on TableComponent) is to copy this component
// It needs to get deleted in the future
export const FirebarrelWidget: React.FC<FirebarrelWidgetProps> = ({
  roomName,
  defaultMute,
  isAudioEffectDisabled,
  onExit,
}) => {
  const { userId, userWithId } = useUser();

  const {
    localParticipant,
    participants,
    disconnect,
    loading,
    renderErrorModal,
  } = useVideoRoomState(userId, roomName);

  // TODO: nordbeavers team should rework
  // how useWorldUsersById stuff used to work here

  // const { worldUsersById } = useWorldUsersById();
  // const firebase = useFirebase();

  // const getUserList = (
  //   room: Video.Room | undefined,
  //   participants: Video.Participant[],
  //   worldUsersById: Record<string, WithId<User>>
  // ) => {
  //   return room ? [...participants.map((p) => worldUsersById[p.identity])] : [];
  // };

  // const convertRemoteParticipantToLocal = (
  //   localParticipant: Video.LocalParticipant | undefined,
  //   participants: Map<string, Video.RemoteParticipant> | undefined
  // ) => {
  //   const result: Video.Participant[] = [];
  //
  //   if (localParticipant) {
  //     result.push(localParticipant as Video.Participant);
  //   }
  //
  //   if (participants) {
  //     for (const key of Array.from(participants.keys())) {
  //       const participant = participants.get(key);
  //       if (participant) {
  //         result.push(participant as Video.Participant);
  //       }
  //     }
  //   }
  //
  //   return result;
  // };

  const [sidedVideoParticipants, otherVideoParticipants] = useMemo(() => {
    const sidedVideoParticipants = participants.slice(
      0,
      NUM_OF_SIDED_USERS_MINUS_ONE
    );

    const otherVideoParticipants = participants.slice(
      NUM_OF_SIDED_USERS_MINUS_ONE
    );

    return [sidedVideoParticipants, otherVideoParticipants];
  }, [participants]);

  const sidedVideos = useMemo(
    () =>
      sidedVideoParticipants.map((participant) => {
        if (!participant) {
          return null;
        }

        return (
          <div
            key={participant.participant.sparkleId}
            className="firebarrel-room__participant"
          >
            <VideoCommsParticipant participant={participant.participant} />
          </div>
        );
      }),
    [sidedVideoParticipants]
  );

  const otherVideos = useMemo(
    () =>
      otherVideoParticipants.map((participant) => {
        if (!participant) {
          return null;
        }

        return (
          <div
            key={participant.participant.sparkleId}
            className="firebarrel-room__participant"
          >
            <VideoCommsParticipant participant={participant.participant} />
          </div>
        );
      }),
    [otherVideoParticipants]
  );

  const myVideo = useMemo(() => {
    return localParticipant && userWithId ? (
      <div
        className="firebarrel-room__participant"
        key={localParticipant.twilioId}
      >
        <VideoCommsParticipant participant={localParticipant} isLocal />
      </div>
    ) : null;
  }, [localParticipant, userWithId]);

  const onExitClick = useCallback(() => {
    // const users = getUserList(
    //   room,
    //   convertRemoteParticipantToLocal(
    //     room?.localParticipant,
    //     room?.participants
    //   ),
    //   worldUsersById
    // );
    // if (!users || users.length <= 1) {
    //   //@debt rewrite this hardcode
    //   firebase
    //     .firestore()
    //     .collection("venues")
    //     .doc(venue.id)
    //     .collection("firebarrels")
    //     .doc(roomName)
    //     .update({ connectedUsers: [] });
    // }

    disconnect();

    if (onExit) {
      onExit(roomName);
    }
    // note: we really doesn't need rerender this for others dependencies
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onExit]);

  if (loading) return null;

  return (
    <>
      <div className="firebarrel-room__exit-btn-wrapper">
        <div className="firebarrel-room__exit-btn-inner">
          <ButtonOG
            customClass="firebarrel-room__exit-btn"
            onClick={onExitClick}
          >
            Leave
          </ButtonOG>
        </div>
      </div>
      <div className="firebarrel-room__participants">
        <div className="firebarrel-room__exit-container" />
        {myVideo}
        {sidedVideos}
        {otherVideos}
      </div>
      {renderErrorModal(() => {
        if (onExit) {
          onExit(roomName);
        }
      })}
    </>
  );
};
