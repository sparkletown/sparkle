import { useCallback, useMemo } from "react";
import { useHistory } from "react-router";

import { AuditoriumVenue } from "types/venues";

import { getAuditoriumSeatedUsers, getSectionCapacity } from "utils/auditorium";
import { WithId } from "utils/id";
import { currentAuditoriumSectionsSelector } from "utils/selectors";
import { getUrlWithoutTrailingSlash } from "utils/url";

import { isLoaded, useFirestoreConnect } from "../useFirestoreConnect";
import { useRecentVenueUsers } from "../users";
import { useSelector } from "../useSelector";
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

  // @debt should be replaced with a subcollection
  const { recentVenueUsers } = useRecentVenueUsers({ venueId });

  const sections = useSelector(currentAuditoriumSectionsSelector);

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
      const sectionCapacity = getSectionCapacity(venue, section);
      const seatedUsers = getAuditoriumSeatedUsers({
        venueId,
        // @debt should be replaced with a subcollection
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
