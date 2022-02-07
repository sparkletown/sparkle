import { useCallback, useMemo, useState } from "react";
import { useHistory } from "react-router";
import { useFirestore, useFirestoreCollectionData } from "reactfire";
import { collection, limit, query } from "firebase/firestore";
import { noop } from "lodash";

import {
  ALWAYS_EMPTY_ARRAY,
  COLLECTION_SECTIONS,
  COLLECTION_SPACES,
  SECTIONS_NEXT_FETCH_SIZE,
} from "settings";

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

  const [fetchSectionsCount, setFetchSectionsCount] = useState(
    SECTIONS_NEXT_FETCH_SIZE
  );

  const loadMore = useCallback(() => {
    setFetchSectionsCount((prev) => prev + SECTIONS_NEXT_FETCH_SIZE);
  }, []);

  const sectionsRef = query(
    collection(firestore, COLLECTION_SPACES, venueId, COLLECTION_SECTIONS),
    limit(fetchSectionsCount)
  ).withConverter(withIdConverter<AuditoriumSection>());

  const { data: sections = ALWAYS_EMPTY_ARRAY } = useFirestoreCollectionData(
    sectionsRef
  );

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
      loadMore: isFullAuditoriumsShown ? loadMore : noop,
      isFullAuditoriumsHidden,
      availableSections: availableSections ?? ALWAYS_EMPTY_ARRAY,
      toggleFullAuditoriums,
      enterSection,
    }),
    [
      isFullAuditoriumsHidden,
      availableSections,
      sections,
      isFullAuditoriumsShown,
      loadMore,
      toggleFullAuditoriums,
      enterSection,
    ]
  );
};
