import { useState, useMemo, useCallback } from "react";
import Fuse from "fuse.js";

import { DEFAULT_DISPLAYED_POSTER_PREVIEW_COUNT } from "settings";

import { ScreeningRoomVideo } from "types/screeningRoom";

import { WithId } from "utils/id";

import { isLoaded, useFirestoreConnect } from "hooks/useFirestoreConnect";
import { useDebounceSearch } from "hooks/useDebounceSearch";

// TODO: Delete mock data
const SCREENING_ROOM_VIDEOS_MOCK: WithId<ScreeningRoomVideo>[] = Array(20)
  .fill(0)
  .map((_, index) => ({
    title: "Video tutorial",
    category: "tutorial",
    subCategory: "video",
    authorName: "Mikhailo Lvov",
    thumbnailSrc: "",
    videoSrc: "",
    id: index.toString(),
  }));

const emptyScreeningRoomVideosArray: never[] = [];

export const useConnectScreeningRoomVideos = (screeningRoomVenueId: string) => {
  // TODO: Implement fetching from screening room venue's subcollection
  useFirestoreConnect();
};

export const useScreeningRoomVideos = (screeningRoomVenueId: string) => {
  useConnectScreeningRoomVideos(screeningRoomVenueId);

  // TODO: Select screening room videos
  // const screeningRoomVideos = useSelector(screeningRoomVideosSelector);
  const screeningRoomVideos = SCREENING_ROOM_VIDEOS_MOCK;

  return useMemo(
    () => ({
      screeningRoomVideos: screeningRoomVideos ?? emptyScreeningRoomVideosArray,
      isScreeningRoomVideosLoaded: isLoaded(screeningRoomVideos),
    }),
    [screeningRoomVideos]
  );
};

export const useScreeningRoom = (screeningRoomVenueId: string) => {
  const {
    screeningRoomVideos,
    isScreeningRoomVideosLoaded: isVideosLoaded,
  } = useScreeningRoomVideos(screeningRoomVenueId);

  const {
    searchInputValue,
    searchQuery,
    setSearchInputValue,
  } = useDebounceSearch();

  const [categoryFilter, _setCategoryFilter] = useState<string>();
  const [subCategoryFilter, setSubCategoryFilter] = useState<string>();
  const [displayedVideosAmount, setDisplayedVideosAmount] = useState(
    DEFAULT_DISPLAYED_POSTER_PREVIEW_COUNT
  );

  const setCategoryFilter = useCallback((category: string) => {
    // Clear previously chosen subcategory
    setSubCategoryFilter(undefined);
    _setCategoryFilter(category);
  }, []);

  const increaseDisplayedVideosAmount = useCallback(() => {
    setDisplayedVideosAmount(
      (prevPostersNumber) =>
        prevPostersNumber + DEFAULT_DISPLAYED_POSTER_PREVIEW_COUNT
    );
  }, []);

  const categoryList = useMemo(
    () =>
      Array.from(new Set(screeningRoomVideos.map((video) => video.category))),
    [screeningRoomVideos]
  );

  const filteredVideosByCategory = useMemo(
    () =>
      categoryFilter
        ? screeningRoomVideos.filter(
            (video) => video.category === categoryFilter
          )
        : screeningRoomVideos,
    [screeningRoomVideos, categoryFilter]
  );

  const subCategoryList = useMemo(
    () =>
      categoryFilter
        ? Array.from(
            new Set(filteredVideosByCategory.map((video) => video.subCategory))
          )
        : [],
    [filteredVideosByCategory]
  );

  const filteredVideosBySubCategory = useMemo(
    () =>
      subCategoryFilter
        ? filteredVideosByCategory.filter(
            (video) => video.category === categoryFilter
          )
        : filteredVideosByCategory,
    [filteredVideosByCategory, subCategoryFilter]
  );

  const fuseVideos = useMemo(
    () =>
      new Fuse(screeningRoomVideos, {
        keys: ["title"],
      }),
    [screeningRoomVideos]
  );

  const searchedVideos = useMemo(() => {
    if (!searchQuery)
      return filteredVideosBySubCategory.slice(0, displayedVideosAmount);

    return fuseVideos
      .search(searchQuery)
      .slice(0, displayedVideosAmount)
      .map((fuseSearchItem) => fuseSearchItem.item);
  }, [
    searchQuery,
    fuseVideos,
    filteredVideosBySubCategory,
    displayedVideosAmount,
  ]);

  return {
    videos: searchedVideos,
    isVideosLoaded,

    categoryList,
    subCategoryList,

    searchInputValue,
    categoryFilter,
    subCategoryFilter,

    increaseDisplayedVideosAmount,
    setSearchInputValue,
    setCategoryFilter,
    setSubCategoryFilter,
  };
};
