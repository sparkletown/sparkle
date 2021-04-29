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
          ["template", "==", VenueTemplate.posterpage],
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
        const { title, author, categories } = venue.poster ?? {};

        const { name, institution } = author ?? {};

        isValid =
          isValid && title
            ? title.toLowerCase().includes(normalizedTitleFilter)
            : true;

        isValid =
          isValid && institution
            ? institution.toLowerCase().includes(normalizedTitleFilter)
            : true;

        isValid =
          isValid && name
            ? name.toLowerCase().includes(normalizedTitleFilter)
            : true;

        isValid =
          isValid && categories
            ? categories.some((category) =>
                category.title.toLowerCase().includes(normalizedTitleFilter)
              )
            : true;
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
