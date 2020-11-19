import firebase from "firebase";
import { useSelector } from "hooks/useSelector";
import { useVenueId } from "hooks/useVenueId";
import _ from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { useCallback } from "react";
import { User } from "types/User";
import { Venue } from "types/Venue";
import { ConvertToEmbeddableUrl } from "utils/ConvertToEmbeddableUrl";
import { WithId } from "utils/id";
// import Video from "twilio-video";

import * as S from "./FireBarrel.styled";
// import LocalParticipant from "components/organisms/Room/LocalParticipant";
// import { useUser } from "hooks/useUser";
// import VideoErrorModal from "components/organisms/Room/VideoErrorModal";
import FireSeat from "./FireSeat";

const DEFAULT_BURN_BARREL_SEATS = 8;

export interface BarrelPeple extends WithId<User> {
  seat: number;
}

const FireBarrel: React.FC = () => {
  const [iframeUrl, setIframeUrl] = useState<string>("");
  const [currentPartygoers, setCurrentPartygoers] = useState<
    BarrelPeple[] | []
  >([]);

  console.log("currentPartygoers: ", currentPartygoers);

  const venueId = useVenueId();

  const { venue, partygoers } = useSelector((state) => ({
    partygoers: state.firestore.ordered.partygoers,
    venue: state.firestore.data.currentVenue,
  }));

  // ------------- GET IFRAME URL
  useEffect(() => {
    firebase
      .firestore()
      .collection("venues")
      .doc(venueId as string)
      .onSnapshot((doc) =>
        setIframeUrl(ConvertToEmbeddableUrl(doc.data()?.iframeUrl || "", true))
      );
  }, [venueId]);

  const chairs =
    currentPartygoers.length > DEFAULT_BURN_BARREL_SEATS
      ? currentPartygoers.length
      : DEFAULT_BURN_BARREL_SEATS;

  // ------------ FILTER UNIQ PARTYGOERS
  const filterPartygoers = (
    venue: Venue,
    partygoers: WithId<User>[]
  ): WithId<User>[] => {
    const filteredPartygoers = _.filter(
      partygoers,
      (person) => person.room === venue?.name
    );

    return _.uniqBy(filteredPartygoers, "partyName");
  };

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
        <S.Barrel src={iframeUrl} />

        {Array.from(Array(chairs)).map((_, index) => {
          const partyPerson = currentPartygoers[index] ?? null;
          if (!partyPerson) {
            return <S.Chair key={index} chairNumber={index} />;
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
    [chairs, currentPartygoers, iframeUrl, venue?.name]
  );
};

export default FireBarrel;
