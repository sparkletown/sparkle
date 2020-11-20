import { useSelector } from "hooks/useSelector";
import React, { useEffect, useMemo, useState } from "react";
import { User } from "types/User";
import { Venue } from "types/Venue";
import { ConvertToEmbeddableUrl } from "utils/ConvertToEmbeddableUrl";
import { WithId } from "utils/id";

import * as S from "./FireBarrel.styled";
import FireSeat from "./FireSeat";

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

  return useMemo(
    () => (
      <S.Wrapper>
        <S.Barrel src={ConvertToEmbeddableUrl(venue?.iframeUrl)} />

        {Array.from(Array(chairs)).map((_, index) => {
          const partyPerson = currentPartygoers[index] ?? null;
          if (!partyPerson) {
            return <S.Chair key={index} isEmpty />;
          }

          return (
            <FireSeat
              key={index}
              person={partyPerson}
              roomName={venue?.name}
              chairNumber={index}
            />
          );
        })}
      </S.Wrapper>
    ),
    [chairs, currentPartygoers, venue]
  );
};

export default FireBarrel;
