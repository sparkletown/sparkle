import { useCallback } from "react";
import { useFirestore, useFirestoreDocData } from "reactfire";
import { doc, where } from "firebase/firestore";

import { COLLECTION_SECTIONS, COLLECTION_SPACES } from "settings";

import { AuditoriumSection } from "types/auditorium";
import { SeatPosition, SectionPositionData } from "types/grid";
import { SectionId, UserWithId } from "types/id";
import { AuditoriumVenue } from "types/venues";

import { withIdConverter } from "utils/converters";
import { WithId } from "utils/id";

import { useSeating } from "hooks/useSeating";

import { useGetUserByPosition } from "../useGetUserByPosition";

export interface UseAuditoriumSectionProps {
  user: UserWithId;
  venue: WithId<AuditoriumVenue>;
  sectionId: SectionId;
}

export const useAuditoriumSection = ({
  user,
  venue,
  sectionId,
}: UseAuditoriumSectionProps) => {
  const { id: venueId } = venue;

  const firestore = useFirestore();

  const sectionRef = doc(
    firestore,
    COLLECTION_SPACES,
    venueId,
    COLLECTION_SECTIONS,
    sectionId
  ).withConverter(withIdConverter<AuditoriumSection>());

  const { data: section, status } = useFirestoreDocData<
    WithId<AuditoriumSection>
  >(sectionRef);

  const isSectionLoaded = status !== "loading";

  const {
    takeSeat,
    leaveSeat,
    seatedUsers,
    isSeatedUsersLoaded,
    takenSeat,
  } = useSeating<SectionPositionData>({
    user,
    worldId: venue.worldId,
    spaceId: venue.id,
    additionalWhere: [where("seatData.sectionId", "==", sectionId)],
  });

  const getUserBySeat = useGetUserByPosition(seatedUsers);

  const wrappedTakeSeat: (
    gridPosition: SeatPosition
  ) => Promise<void> = useCallback(
    ({ seatIndex }: SeatPosition) => {
      return takeSeat({
        sectionId,
        seatIndex,
      });
    },
    [takeSeat, sectionId]
  );

  return {
    auditoriumSection: section,
    isAuditoriumSectionLoaded: isSectionLoaded,

    takenSeat,
    isSeatedUsersLoaded,

    getUserBySeat,
    takeSeat: wrappedTakeSeat,
    leaveSeat,
  };
};
