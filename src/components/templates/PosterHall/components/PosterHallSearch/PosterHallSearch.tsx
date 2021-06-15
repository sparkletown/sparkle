import React, { useCallback } from "react";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

import { InputField } from "components/atoms/InputField";
import { Checkbox } from "components/atoms/Checkbox";

import "./PosterHallSearch.scss";

import { POSTERHALL_POSTER_IS_LIVE_TEXT } from "settings";

export interface PosterHallSearchProps {
  searchInputValue?: string;
  setSearchInputValue: (title: string) => void;

  liveFilterValue: boolean;
  setLiveValue: (isLive: boolean) => void;

  bookmarkedFilterValue: boolean;
  setBookmarkedValue: (isSaved: boolean) => void;

  showBookmarks?: boolean;
}

export const PosterHallSearch: React.FC<PosterHallSearchProps> = ({
  searchInputValue,
  setSearchInputValue,

  liveFilterValue,
  setLiveValue,

  bookmarkedFilterValue,
  setBookmarkedValue,

  showBookmarks = false,
}) => {
  const onInputFieldChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchInputValue(e.target.value);
    },
    [setSearchInputValue]
  );

  const onCheckboxChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setLiveValue(e.target.checked),
    [setLiveValue]
  );

  const onCheckboxBookmarkChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setBookmarkedValue(e.target.checked),
    [setBookmarkedValue]
  );

  return (
    <div className="PosterHallSearch">
      <InputField
        containerClassName="PosterHallSearch__input-container"
        inputClassName="PosterHallSearch__input"
        iconStart={faSearch}
        placeholder="Search Posters/Demos"
        value={searchInputValue}
        onChange={onInputFieldChange}
      />
      <Checkbox
        checked={liveFilterValue}
        onChange={onCheckboxChange}
        label={POSTERHALL_POSTER_IS_LIVE_TEXT}
        containerClassName="PosterHallSearch__checkbox"
      />
      {showBookmarks && (
        <Checkbox
          checked={bookmarkedFilterValue}
          onChange={onCheckboxBookmarkChange}
          label="Poster is bookmarked"
          containerClassName="PosterHallSearch__checkbox"
        />
      )}
    </div>
  );
};
