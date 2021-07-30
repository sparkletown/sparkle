import React, { useCallback, useMemo, useState } from "react";
import firebase from "firebase/app";

import { VideoState } from "types/User";

import { ConvertToEmbeddableUrl } from "utils/ConvertToEmbeddableUrl";
import { currentVenueSelector } from "utils/selectors";

import { useUser } from "hooks/useUser";
import { useRecentVenueUsers, useWorldUsersById } from "hooks/users";
import { useSelector } from "hooks/useSelector";
import { useVideoRoomState } from "hooks/twilio";

import VideoErrorModal from "components/organisms/Room/VideoErrorModal";
import { LoadingPage } from "components/molecules/LoadingPage/LoadingPage";
import LocalParticipant from "../Playa/Video/LocalParticipant";
import RemoteParticipant from "../Playa/Video/RemoteParticipant";

import * as S from "./FireBarrel.styled";

const DEFAULT_BURN_BARREL_SEATS = 8;

// @debt refactor this to pass in venue as a prop
export const FireBarrel: React.FC = () => {
  const venue = useSelector(currentVenueSelector);
  const { recentVenueUsers, isRecentVenueUsersLoaded } = useRecentVenueUsers({
    venueName: venue?.name,
  });

  const chairs =
    recentVenueUsers?.length > DEFAULT_BURN_BARREL_SEATS
      ? recentVenueUsers.length
      : DEFAULT_BURN_BARREL_SEATS;

  const { userId, profile, userWithId } = useUser();

  const { room, participants } = useVideoRoomState({
    userId,
    roomName: venue?.name,
  });

  const chairsArray = Array.from(Array(chairs));

  const [videoError, setVideoError] = useState<string>("");
  const { worldUsersById } = useWorldUsersById();

  const updateVideoState = useCallback(
    (update: VideoState) => {
      if (!userId) return;

      firebase.firestore().doc(`users/${userId}`).update({ video: update });
    },
    [userId]
  );

  const leave = useCallback(() => {
    if (profile) {
      profile.video = {};
    }
    updateVideoState({});
  }, [profile, updateVideoState]);

  const removeParticipant = useCallback(
    (uid: string) => {
      if (!profile?.video) return;
      const removed = profile.video.removedParticipantUids || [];
      if (!removed.includes(uid)) {
        removed.push(uid);
      }
      updateVideoState({
        ...profile.video,
        removedParticipantUids: removed,
      });
    },
    [updateVideoState, profile]
  );

  return useMemo(() => {
    if (!isRecentVenueUsersLoaded || !userWithId) return <LoadingPage />;

    return (
      <S.Wrapper>
        <S.Barrel src={ConvertToEmbeddableUrl(venue?.iframeUrl)} />

        {chairsArray.map((_, index) => {
          const partyPerson = recentVenueUsers[index] ?? null;

          const isMe = partyPerson?.id === userId;

          if (!recentVenueUsers[index]) {
            return <S.Chair key={index} isEmpty />;
          }

          if (!!room && isMe) {
            return (
              <S.Chair key={userId}>
                <LocalParticipant
                  showLeave={false}
                  participant={room.localParticipant}
                  user={userWithId}
                  isHost={false}
                  leave={leave}
                  useFontAwesome
                  showName={false}
                />
              </S.Chair>
            );
          }

          if (participants.length && !!participants[index]) {
            const participant = participants[index];
            const participantUserData = worldUsersById[
              participant.identity
            ] && {
              ...worldUsersById[participant.identity],
              id: participant.identity,
            };

            return (
              <S.Chair key={participant.identity}>
                <RemoteParticipant
                  participant={participant}
                  user={participantUserData}
                  isHost={false}
                  showHostControls={false}
                  remove={() => removeParticipant(participant.identity)}
                />
              </S.Chair>
            );
          }

          return <React.Fragment key={index}></React.Fragment>;
        })}

        <VideoErrorModal
          show={!!videoError}
          onHide={() => setVideoError("")}
          errorMessage={videoError}
          onRetry={() => {}}
          onBack={() => {}}
        />
      </S.Wrapper>
    );
  }, [
    chairsArray,
    recentVenueUsers,
    userWithId,
    leave,
    participants,
    removeParticipant,
    room,
    userId,
    worldUsersById,
    videoError,
    venue,
    isRecentVenueUsersLoaded,
  ]);
};
