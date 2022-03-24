import React, { useCallback } from "react";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { InputField } from "components/attendee/InputField";

import { ALWAYS_NOOP_FUNCTION } from "settings";

import "./PosterHallSearch.scss";

export interface PosterHallSearchProps {
  searchInputValue?: string;
  setSearchInputValue: (title: string) => void;
}

export const PosterHallSearch: React.FC<PosterHallSearchProps> = ({
  searchInputValue,
  setSearchInputValue,
}) => {
  const onInputFieldChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchInputValue(e.target.value);
    },
    [setSearchInputValue]
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
        register={ALWAYS_NOOP_FUNCTION}
      />
    </div>
  );
};
