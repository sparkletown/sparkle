import { useCallback, useMemo } from "react";
import { useHistory } from "react-router";

import { AuditoriumVenue } from "types/venues";

import { getAuditoriumSeatedUsers, getSectionCapacity } from "utils/auditorium";
import { WithId } from "utils/id";
import { currentAuditoriumSectionsSelector } from "utils/selectors";
import { removeTrailingSlash } from "utils/url";

import { useSelector } from "../useSelector";
import { useFirestoreConnect, isLoaded } from "../useFirestoreConnect";
import { useRecentVenueUsers } from "../users";
import { useShowHide } from "../useShowHide";

export const useConnectAllAuditoriumSections = (venueId?: string) => {
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

export const useAllAuditoriumSections = (venue: WithId<AuditoriumVenue>) => {
  const venueId = venue.id;
  useConnectAllAuditoriumSections(venueId);

  const history = useHistory();

  const {
    isShown: isFullAuditoriumsShown,
    toggle: toggleFullAuditoriums,
  } = useShowHide(true);

  const isFullAuditoriumsHidden = !isFullAuditoriumsShown;

  const { recentVenueUsers } = useRecentVenueUsers();

  const sections = useSelector(currentAuditoriumSectionsSelector);

  const enterSection = useCallback(
    (sectionId: string) => {
      history.push(
        `${removeTrailingSlash(history.location.pathname)}/section/${sectionId}`
      );
    },
    [history]
  );

  const availableSections = useMemo(() => {
    if (!sections) return;

    return sections.filter((section) => {
      const sectionCapacity = getSectionCapacity(venue, section);
      const seatedUsers = getAuditoriumSeatedUsers({
        venueId,
        auditoriumUsers: recentVenueUsers,
        sectionId: section.id,
      });

      return seatedUsers.length < sectionCapacity;
    });
  }, [recentVenueUsers, venue, venueId, sections]);

  return useMemo(
    () => ({
      auditoriumSections:
        (isFullAuditoriumsHidden ? availableSections : sections) ?? [],
      isAuditoriumSectionsLoaded: isLoaded(sections),
      isFullAuditoriumsHidden,
      availableSections: availableSections ?? [],
      toggleFullAuditoriums,
      enterSection,
    }),
    [
      sections,
      availableSections,
      isFullAuditoriumsHidden,
      toggleFullAuditoriums,
      enterSection,
    ]
  );
};
