import { useSelector } from "hooks/useSelector";
import React, { useEffect, useMemo, useState } from "react";
import { User } from "types/User";
import { Venue } from "types/Venue";
import { ConvertToEmbeddableUrl } from "utils/ConvertToEmbeddableUrl";
import { WithId } from "utils/id";

import * as S from "./FireBarrel.styled";
import { useVideoState } from "./useVideo";
import { useUser } from "../../../hooks/useUser";
import { LocalParticipant, RemoteParticipant } from "twilio-video";
import VideoErrorModal from "../../organisms/Room/VideoErrorModal";

const DEFAULT_BURN_BARREL_SEATS = 8;

export interface BarrelPeple extends WithId<User> {
  seat: number;
}

const FireBarrel: React.FC = () => {
  const [currentPartygoers, setCurrentPartygoers] = useState<
    BarrelPeple[] | []
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
      const seatedPartyPeople: BarrelPeple[] = partyPeople.map(
        (person, index) => ({
          ...person,
          seat: index,
        })
      );
      setCurrentPartygoers(seatedPartyPeople);
    }
  }, [partygoers, venue]);

  const { user } = useUser();

  const { room } = useVideoState({ userUid: user?.uid, roomName: venue?.name });

  const chairsArray = Array.from(Array(chairs));

  const [videoError, setVideoError] = useState<string>("");

  return useMemo(
    () => (
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
              <LocalParticipant
                participant={room?.localParticipant}
                profileData={profileData}
                profileDataId={room?.localParticipant.identity}
                showIcon={false}
              />
            );
          }

          if (!!room && !isMe) {
            return (
              <RemoteParticipant
                participant={room?.TODO}
                profileData={profileData}
                profileDataId={room?.localParticipant.identity}
                showIcon={false}
              />
            );
          }

          // return (
          //   <S.Chair isEmpty={false}>
          //     // TODO make the styled component stuff work again
          //   </S.Chair>
          // );
        })}

        <VideoErrorModal
          show={!!videoError}
          onHide={() => setVideoError("")}
          errorMessage={videoError}
          // onRetry={connectToVideoRoom}
          onRetry={() => {}}
          onBack={() => {}}
          // onBack={() => (setSeatedAtTable ? leaveSeat() : setVideoError(""))}
        />
      </S.Wrapper>
    ),
    [chairsArray, currentPartygoers, room, user?.uid, venue?.iframeUrl]
  );
};

export default FireBarrel;
