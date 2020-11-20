import { useKeyedSelector, useSelector } from "hooks/useSelector";
import React, { useEffect, useState } from "react";
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
import firebase from "firebase";

const DEFAULT_BURN_BARREL_SEATS = 8;

export interface BarrelPeple extends WithId<User> {
  seat: number;
}

const FireBarrel: React.FC = () => {
  const [currentPartygoers, setCurrentPartygoers] = useState<
    WithId<User>[] | []
  >([]);

  const venue = useSelector((state) => state.firestore.data.currentVenue);
  const partygoers = useSelector((state) => state.firestore.ordered.partygoers);

  const chairs =
    currentPartygoers.length > DEFAULT_BURN_BARREL_SEATS
      ? currentPartygoers.length
      : DEFAULT_BURN_BARREL_SEATS;

  const filterPartygoers = (
    venue: Venue,
    partygoers: WithId<User>[]
  ): WithId<User>[] =>
    partygoers.filter((person) => person.room === venue?.name);

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
      users: state.firestore.data.partygoers,
    }),
    ["users"]
  );

  if (!user || !profile) return <></>;

  const updateVideoState = (update: VideoState) => {
    firebase.firestore().doc(`users/${user.uid}`).update({ video: update });
  };

  const leave = () => {
    profile.video = {};
    updateVideoState({});
  };

  const removeParticipant = (uid: string) => {
    if (!profile.video) return;
    const removed = profile.video.removedParticipantUids || [];
    if (!removed.includes(uid)) {
      removed.push(uid);
    }
    updateVideoState({
      ...profile.video,
      removedParticipantUids: removed,
    });
  };

  return (
    <S.Wrapper>
      <S.Barrel src={ConvertToEmbeddableUrl(venue?.iframeUrl)} />

      {chairsArray.map((_, index) => {
        const partyPerson = currentPartygoers[index] ?? null;

        const isMe = partyPerson?.id === user?.uid;

        if (!partyPerson) {
          return <S.Chair key={index} isEmpty />;
        }

        if (!!room && isMe) {
          return (
            <S.Chair>
              <LocalParticipant
                // TODO: FIX STYLING FOR BUTTONS
                showLeave={false}
                participant={room.localParticipant}
                user={user}
                setSelectedUserProfile={() => {}}
                isHost={false}
                leave={leave}
              />
            </S.Chair>
          );
        }

        return participants.map((participant) => (
          <S.Chair key={participant.identity}>
            <RemoteParticipant
              // TODO: FIX STYLING FOR BUTTONS
              participant={participant}
              user={users[participant.identity]}
              setSelectedUserProfile={() => {}}
              isHost={false}
              showHostControls={false}
              remove={() => removeParticipant(participant.identity)}
            />
          </S.Chair>
        ));
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
};

export default FireBarrel;
