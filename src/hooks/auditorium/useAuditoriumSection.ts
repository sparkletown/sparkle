import { useCallback, useMemo } from "react";
import { useFirestore, useFirestoreDocData } from "reactfire";
import { doc, where } from "firebase/firestore";

import { COLLECTION_SECTIONS, COLLECTION_SPACES } from "settings";

import { setSeat, unsetSeat } from "api/world";

import { AuditoriumSection } from "types/auditorium";
import { SeatPosition, SectionGridData } from "types/grid";
import { AuditoriumVenue } from "types/venues";

import { withIdConverter } from "utils/converters";
import { WithId } from "utils/id";

import { useSeatedUsers } from "hooks/useSeatedUsers";

import { useGetUserByPosition } from "../useGetUserByPosition";
import { useUser } from "../useUser";

export interface UseAuditoriumSectionProps {
  venue: WithId<AuditoriumVenue>;
  sectionId: string;
}

export const useAuditoriumSection = ({
  venue,
  sectionId,
}: UseAuditoriumSectionProps) => {
  const { id: venueId } = venue;

  const firestore = useFirestore();

  const { userWithId } = useUser();
  const userId = userWithId?.id;

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

  const { users: seatedUsers } = useSeatedUsers<SectionGridData>({
    worldId: venue.worldId,
    spaceId: venueId,
    additionalWhere: [where("seatedData.sectionId", "==", sectionId)],
  });

  const isUserSeated = useMemo(
    () => seatedUsers?.some((seatedUser) => seatedUser.id === userId),
    [seatedUsers, userId]
  );

  const getUserBySeat = useGetUserByPosition(seatedUsers);

  const takeSeat: (
    gridPosition: SeatPosition
  ) => Promise<void> | undefined = useCallback(
    ({ seatIndex }: SeatPosition) => {
      if (!sectionId || !venueId || !userWithId) return;

      return setSeat<SectionGridData>({
        user: userWithId,
        worldId: venue.worldId,
        spaceId: venueId,
        seatData: {
          sectionId,
          seatIndex,
        },
      });
    },
    [sectionId, venueId, userWithId, venue.worldId]
  );

  const leaveSeat: () => Promise<void> | undefined = useCallback(() => {
    if (!venueId || !userId || !sectionId) return;

    return unsetSeat({ userId, worldId: venue.worldId });
  }, [venueId, userId, sectionId, venue.worldId]);

  return {
    auditoriumSection: section,
    isAuditoriumSectionLoaded: isSectionLoaded,

    isUserSeated,

    getUserBySeat,
    takeSeat,
    leaveSeat,
  };
};
