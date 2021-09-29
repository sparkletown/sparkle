import { useCallback, useMemo } from "react";
import { useHistory } from "react-router";
import { useFirestore, useFirestoreCollectionData } from "reactfire";

import { ALWAYS_EMPTY_ARRAY } from "settings";

import { AuditoriumSection } from "types/auditorium";
import { AuditoriumVenue } from "types/venues";

import { getSectionCapacity } from "utils/auditorium";
import { withIdConverter } from "utils/converters";
import { WithId } from "utils/id";
import { getUrlWithoutTrailingSlash } from "utils/url";

import { useShowHide } from "../useShowHide";

export const useAllAuditoriumSections = (venue: WithId<AuditoriumVenue>) => {
  const venueId = venue.id;

  const history = useHistory();
  const firestore = useFirestore();

  const {
    isShown: isFullAuditoriumsShown,
    toggle: toggleFullAuditoriums,
  } = useShowHide(true);

  const isFullAuditoriumsHidden = !isFullAuditoriumsShown;

  const sectionsRef = firestore
    .collection("venues")
    .doc(venueId)
    .collection("sections")
    .withConverter(withIdConverter);

  const {
    data: sections = ALWAYS_EMPTY_ARRAY,
    status,
  } = useFirestoreCollectionData<WithId<AuditoriumSection>>(sectionsRef);

  const isSectionsLoaded = status !== "loading";

  const enterSection = useCallback(
    (sectionId: string) => {
      history.push(
        `${getUrlWithoutTrailingSlash(
          history.location.pathname
        )}/section/${sectionId}`
      );
    },
    [history]
  );

  const availableSections = useMemo(() => {
    if (!sections) return;

    return sections.filter((section) => {
      const seatedUsersCount = section?.seatedUsersCount ?? 0;
      const sectionCapacity = getSectionCapacity(venue, section);

      return seatedUsersCount < sectionCapacity;
    });
  }, [venue, sections]);

  return useMemo(
    () => ({
      auditoriumSections:
        (isFullAuditoriumsHidden ? availableSections : sections) ??
        ALWAYS_EMPTY_ARRAY,
      isAuditoriumSectionsLoaded: isSectionsLoaded,
      isFullAuditoriumsHidden,
      availableSections: availableSections ?? ALWAYS_EMPTY_ARRAY,
      toggleFullAuditoriums,
      enterSection,
    }),
    [
      sections,
      availableSections,
      isSectionsLoaded,
      isFullAuditoriumsHidden,
      toggleFullAuditoriums,
      enterSection,
    ]
  );
};
