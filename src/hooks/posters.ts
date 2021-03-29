import { useCallback, useState, useMemo } from "react";
import { useSelector } from "react-redux";

import { useFirestoreConnect } from "./useFirestoreConnect";

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
  titleFilter = '',
  categoriesFilter = [],
}: UsePostersProps) => {
  useFirestoreConnect(() => {
    return [
      {
        collection: "venues",
        // NOTE: This filters out all venues that don't have poster object defined
        orderBy: ["poster", "asc"],
        storeAs: "worldUsers",
      },
    ];
  });

  const unfilteredPosters = useSelector();



  return {
    posters: unfilteredPosters
      .filter( poster => poster.includes(titleFilter) && categoriesFilter.every(category => poster.categories.includes(category)) )
    isPostersLoaded: true
  }
};
