import { useState } from "react";

import { posterVenuesSelector } from "utils/selectors";

import { useFirestoreConnect } from "./useFirestoreConnect";
import { useSelector } from "./useSelector";

export const usePosterFilters = () => {
  const [titleFilter, setTitleFilter] = useState<string>();

  const [categoriesFilter, setCategoriesFilter] = useState<[]>();

  return {
    titleFilter,
    categoriesFilter,

    setTitleFilter,
    setCategoriesFilter,
  };
};

export enum PosterFilterTypes {
  CATEGORY = "category",
  TITLE = "title",
}

export type TitlePosterFilter = {
  type: PosterFilterTypes.TITLE;
  title: string;
};

export type CategoriesPosterFilter = {
  type: PosterFilterTypes.CATEGORY;
  categories: [];
};

export type PosterFilters = TitlePosterFilter | CategoriesPosterFilter;

export interface UsePostersProps {
  titleFilter?: string;
  categoriesFilter?: [];
}

export const usePosters = ({
  titleFilter = "",
  categoriesFilter = [],
}: UsePostersProps) => {
  useFirestoreConnect(() => {
    return [
      {
        collection: "venues",
        // NOTE: This filters out all venues that don't have poster object defined
        orderBy: ["poster", "asc"],
        storeAs: "posterVenues",
      },
    ];
  });

  const posterVenues = useSelector(posterVenuesSelector);

  return {
    posterVenues: posterVenues?.filter((venue) => {
      const normalizedTitleFilter = titleFilter.toLowerCase().trim();

      if (
        normalizedTitleFilter &&
        !venue.poster.title.toLowerCase().includes(normalizedTitleFilter)
      ) {
        return false;
      }

      return true;
      // if (categoriesFilter?.length > 0) {
      //   categoriesFilter.every((category) =>
      //     venue.poster.categories.includes(category)
      //   );
      // }
    }),
    isPostersLoaded: true,
  };
};
