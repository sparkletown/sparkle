import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

import "./Search.scss";

export const Search = () => {
  return (
    <div className="posterhall__search">
      <div className="posterhall__search__input-box">
        <div className="posterhall__search__icon-box">
          <FontAwesomeIcon icon={faSearch} size="sm" />
        </div>

        <input
          className="posterhall__search__input"
          placeholder="Search Posters/Demos"
        />
      </div>
    </div>
  );
};
