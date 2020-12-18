import { useKeyedSelector, useSelector } from "hooks/useSelector";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { User, VideoState } from "types/User";
import { Venue } from "types/Venue";
import { ConvertToEmbeddableUrl } from "utils/ConvertToEmbeddableUrl";
import { WithId } from "utils/id";

import * as S from "./FireBarrel.styled";
import { useVideoState } from "./useVideo";
import { useUser } from "hooks/useUser";

import VideoErrorModal from "components/organisms/Room/VideoErrorModal";
import LocalParticipant from "../Playa/Video/LocalParticipant";
import RemoteParticipant from "../Playa/Video/RemoteParticipant";
import firebase from "firebase/app";
import { currentVenueSelector } from "utils/selectors";
import { LoadingPage } from "components/molecules/LoadingPage/LoadingPage";
import { usePartygoers } from "hooks/useUsers";

const DEFAULT_BURN_BARREL_SEATS = 8;

const FireBarrel: React.FC = () => {
  const [currentPartygoers, setCurrentPartygoers] = useState<
    WithId<User>[] | []
  >([]);

  const venue = useSelector(currentVenueSelector);
  const partygoers = usePartygoers();

  const chairs =
    currentPartygoers?.length > DEFAULT_BURN_BARREL_SEATS
      ? currentPartygoers.length
      : DEFAULT_BURN_BARREL_SEATS;

  const filterPartygoers = (
    venue: Venue,
    partygoers: WithId<User>[]
  ): WithId<User>[] =>
    partygoers?.filter((person) => person.room === venue?.name);

  useEffect(() => {
    if (venue) {
      const partyPeople = filterPartygoers(venue, partygoers);

      setCurrentPartygoers(partyPeople);
    }
  }, [partygoers, venue]);

  const { user, profile } = useUser();

  const { room, participants } = useVideoState({
    userUid: user?.uid,
    roomName: venue?.name,
  });

  const chairsArray = Array.from(Array(chairs));

  const [videoError, setVideoError] = useState<string>("");
  const { users } = useKeyedSelector(
    (state) => ({
      users: state.firestore.data.partygoers ?? {},
    }),
    ["users"]
  );

  const updateVideoState = useCallback(
    (update: VideoState) => {
      if (!user) return;
      firebase.firestore().doc(`users/${user.uid}`).update({ video: update });
    },
    [user]
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
    if (!currentPartygoers) return <LoadingPage />;

    return (
      <S.Wrapper>
        <S.Barrel src={ConvertToEmbeddableUrl(venue?.iframeUrl)} />

        {chairsArray.map((_, index) => {
          const partyPerson = currentPartygoers[index] ?? null;

          const isMe = partyPerson?.id === user?.uid;

          if (!currentPartygoers[index]) {
            return <S.Chair key={index} isEmpty />;
          }

          if (!!room && isMe) {
            return (
              <S.Chair key={user!.uid}>
                <LocalParticipant
                  showLeave={false}
                  participant={room.localParticipant}
                  user={users[user!.uid]}
                  setSelectedUserProfile={() => {}}
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

            return (
              <S.Chair key={participant.identity}>
                <RemoteParticipant
                  participant={participant}
                  user={users[participant.identity]}
                  setSelectedUserProfile={() => {}}
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
    currentPartygoers,
    leave,
    participants,
    removeParticipant,
    room,
    user,
    users,
    videoError,
    venue,
  ]);
};

export default FireBarrel;
