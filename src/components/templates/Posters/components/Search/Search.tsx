import React, { ChangeEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

import "./Search.scss";

export interface SearchProps {
  titleValue?: string;
  setTitleValue: (title: string) => void;
}

export const Search: React.FC<SearchProps> = ({
  titleValue,
  setTitleValue,
}) => {
  const onTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitleValue(e.target.value);
  };
  return (
    <div className="posterhall__search">
      <div className="posterhall__search__input-box">
        <div className="posterhall__search__icon-box">
          <FontAwesomeIcon icon={faSearch} size="sm" />
        </div>

        <input
          className="posterhall__search__input"
          placeholder="Search Posters/Demos"
          value={titleValue}
          onChange={onTitleChange}
        />
      </div>
    </div>
  );
};
