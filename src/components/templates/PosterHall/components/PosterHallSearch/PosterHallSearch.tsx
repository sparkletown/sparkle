import React, { useCallback } from "react";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

import { InputField } from "components/atoms/InputField";
import { Checkbox } from "components/atoms/Checkbox";

import "./PosterHallSearch.scss";

export interface PosterHallSearchProps {
  titleFilterValue?: string;
  setTitleValue: (title: string) => void;

  liveFilterValue: boolean;
  setLiveValue: (isLive: boolean) => void;
}

export const PosterHallSearch: React.FC<PosterHallSearchProps> = ({
  titleFilterValue,
  setTitleValue,

  liveFilterValue,
  setLiveValue,
}) => {
  const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitleValue(e.target.value);
  };

  const onCheckboxChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setLiveValue(e.target.checked),
    [setLiveValue]
  );

  return (
    <div className="PosterHallSearch">
      <InputField
        containerClassName="PosterHallSearch__input-container"
        inputClassName="PosterHallSearch__input"
        iconStart={faSearch}
        placeholder="Search Posters/Demos"
        value={titleFilterValue}
        onChange={onTitleChange}
      />
      <Checkbox
        checked={liveFilterValue}
        onChange={onCheckboxChange}
        title="Presenter is online"
        containerClassName="PosterHallSearch__checkbox"
      />
    </div>
  );
};
