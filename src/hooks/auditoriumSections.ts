import {
  currentAuditoriumSectionsSelector,
  currentAuditoriumSectionsByIdSelector,
} from "utils/selectors";

import { useSelector } from "./useSelector";
import { useFirestoreConnect, isLoaded } from "./useFirestoreConnect";
import { useRecentVenueUsers } from "./users";
import { WithId } from "utils/id";
import { User } from "types/User";
import { takeSectionSeat } from "api/section";
import { useUser } from "./useUser";

const useConnectAuditoriumSections = (venueId?: string) => {
  useFirestoreConnect(() => {
    if (!venueId) return [];

    return [
      {
        collection: "venues",
        doc: venueId,
        subcollections: [{ collection: "sections" }],
        storeAs: "currentAuditoriumSections",
      },
    ];
  });
};

export interface useAuditoriumSectionProps {
  venueId?: string;
  sectionId?: string;
}

const getPositionHash = ({ row, column }: { row: number; column: number }) => {
  return `${row}|${column}`;
};

export const useAuditoriumSection = ({
  venueId,
  sectionId,
}: useAuditoriumSectionProps) => {
  useConnectAuditoriumSections(venueId);

  const { userWithId } = useUser();

  const userId = userWithId?.id;

  const sections = useSelector(currentAuditoriumSectionsByIdSelector);

  const section = sections?.[sectionId!];

  const seatedUsers = useSectionSeatedUsers(venueId, sectionId);

  const seatedUsersByHash = seatedUsers.reduce<
    Record<string, WithId<User> | undefined>
  >((acc, user) => {
    if (!venueId) return acc;

    const takenRow = user.data?.[venueId].row;
    const takenColumn = user.data?.[venueId].column;

    if (takenRow === undefined || takenColumn === undefined) return acc;

    const positionHash = getPositionHash({
      row: takenRow,
      column: takenColumn,
    });

    return { ...acc, [positionHash]: user };
  }, {});

  const getUserBySeat = ({ row, column }: { row: number; column: number }) =>
    seatedUsersByHash && seatedUsersByHash[getPositionHash({ row, column })];

  const takeSeat = ({ row, column }: { row: number; column: number }) => {
    if (!sectionId || !venueId || !userId) return;

    takeSectionSeat({
      venueId,
      userId,
      seatOptions: { sectionId, row, column },
    });
  };

  const leaveSeat = () => {
    if (!venueId || !userId) return;

    takeSectionSeat({ venueId, userId, seatOptions: null });
  };

  return {
    auditoriumSection: section,
    isAuditoriumSectionLoaded: isLoaded(sections),
    getUserBySeat,
    takeSeat,
    leaveSeat,
  };
};

export const useSectionSeatedUsers = (venueId?: string, sectionId?: string) => {
  const { recentVenueUsers } = useRecentVenueUsers();

  return recentVenueUsers.filter(
    (user) =>
      venueId && sectionId && user.data?.[venueId]?.sectionId === sectionId
  );
};

export const useAuditoriumSections = (venueId?: string) => {
  useConnectAuditoriumSections(venueId);

  const sections = useSelector(currentAuditoriumSectionsSelector);

  return {
    auditoriumSections: sections ?? [],
    isAuditoriumSectionsLoaded: isLoaded(sections),
  };
};
