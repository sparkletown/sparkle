import { AuditoriumSection } from "types/auditorium";
import {
  currentAuditoriumSectionsSelector,
  currentAuditoriumSectionsByIdSelector,
} from "utils/selectors";

import { useSelector } from "./useSelector";
import { useFirestoreConnect, isLoaded } from "./useFirestoreConnect";

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

export const useAuditoriumSection = ({
  venueId,
  sectionId,
}: useAuditoriumSectionProps) => {
  useConnectAuditoriumSections(venueId);

  const sections = useSelector(currentAuditoriumSectionsByIdSelector);

  return {
    auditoriumSection: sectionId && sections?.[sectionId],
    isAuditoriumSectionLoaded: isLoaded(sections),
  };
};

export const useAuditoriumSections = (venueId?: string) => {
  useConnectAuditoriumSections(venueId);

  const sections = useSelector(currentAuditoriumSectionsSelector);

  console.log({ sections });

  return {
    auditoriumSections: sections ?? [],
    isAuditoriumSectionsLoaded: isLoaded(sections),
  };
};
