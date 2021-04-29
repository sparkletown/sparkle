import { useState } from "react";
import { VenueTemplate } from "types/venues";

import { posterVenuesSelector } from "utils/selectors";

import { isLoaded, useFirestoreConnect } from "./useFirestoreConnect";
import { useSelector } from "./useSelector";

export const useConnectPosterVenues = (posterHallId: string) => {
  useFirestoreConnect(() => {
    return [
      {
        collection: "venues",
        where: [
          ["template", "==", VenueTemplate.poster],
          ["parentId", "==", posterHallId],
        ],
        storeAs: "posterVenues",
      },
    ];
  });
};

export interface UsePostersProps {
  posterHallId: string;
  titleFilter?: string;
  categoriesFilter?: [];
  liveFilter?: boolean;
}

export const usePosters = ({ posterHallId }: UsePostersProps) => {
  useConnectPosterVenues(posterHallId);

  const posterVenues = useSelector(posterVenuesSelector);

  const [titleFilter, setTitleFilter] = useState<string>();

  const [liveFilter, setLiveFilter] = useState<boolean>(false);

  return {
    posterVenues: posterVenues?.filter((venue) => {
      // TODO: Find a more neat way to filter out posters
      let isValid = true;
      const normalizedTitleFilter = titleFilter?.toLowerCase().trim();

      if (normalizedTitleFilter) {
        const {
          title,
          author: { name, institution },
          categories,
        } = venue.poster;
        isValid =
          isValid &&
          (title.toLowerCase().includes(normalizedTitleFilter) ||
            institution.toLowerCase().includes(normalizedTitleFilter) ||
            name.toLowerCase().includes(normalizedTitleFilter) ||
            categories?.some((category) =>
              category.title.toLowerCase().includes(normalizedTitleFilter)
            ));
      }

      if (liveFilter) isValid = isValid && !!venue.isLive;

      return isValid;
    }),
    titleFilter,
    liveFilter,

    setTitleFilter,
    setLiveFilter,
    isPostersLoaded: isLoaded(posterVenues),
  };
};
