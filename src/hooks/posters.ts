import { useState } from "react";
import { VenueTemplate } from "types/venues";
import Fuse from "fuse.js";

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

export const usePosterVenues = (posterHallId: string) => {
  useConnectPosterVenues(posterHallId);

  const posterVenues = useSelector(posterVenuesSelector);

  return {
    posterVenues: posterVenues ?? [],
    isPostersLoaded: isLoaded(posterVenues),
  };
};

export const usePosters = (posterHallId: string) => {
  const { posterVenues } = usePosterVenues(posterHallId);

  const [titleFilter, setTitleFilter] = useState<string>();

  const [liveFilter, setLiveFilter] = useState<boolean>(false);

  const fusePosterVenues = new Fuse(posterVenues, {
    keys: ["poster.title", "poster.authorName", "poster.categories"],
  });

  return {
    posterVenues: titleFilter
      ? fusePosterVenues
          .search(titleFilter)
          .map((fuseItem) => fuseItem.item)
          .filter((venue) => (liveFilter ? venue.isLive : true))
      : posterVenues,

    titleFilter,
    liveFilter,

    setTitleFilter,
    setLiveFilter,
  };
};
