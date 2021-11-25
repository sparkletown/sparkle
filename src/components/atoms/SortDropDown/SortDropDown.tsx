import React from "react";
import {
  Dropdown as ReactBootstrapDropdown,
  DropdownButton,
} from "react-bootstrap";

import { SortingOptions } from "utils/venue";

import "./SortDropDown.scss";

interface SpaceSortDropDownProps {
  onClick?: (value: SortingOptions) => void;
}

export const SortDropDown: React.FC<SpaceSortDropDownProps> = ({ onClick }) => (
  <div className="SortDropDown">
    <DropdownButton variant="secondary" title="Sort spaces">
      {Object.values(SortingOptions).map((sortingOption) => (
        <ReactBootstrapDropdown.Item
          key={sortingOption}
          onClick={() => onClick?.(sortingOption)}
        >
          {sortingOption}
        </ReactBootstrapDropdown.Item>
      ))}
    </DropdownButton>
  </div>
);
