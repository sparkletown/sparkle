import React from "react";
import {
  Dropdown as ReactBootstrapDropdown,
  DropdownButton,
} from "react-bootstrap";

import { SortingOptions } from "utils/venue";

import "./SortDropDown.scss";

interface SortDropDownProps {
  onClick: (value: SortingOptions) => void;
  title: string;
}

export const SortDropDown: React.FC<SortDropDownProps> = ({
  onClick,
  title,
}) => (
  <div className="SortDropDown">
    <DropdownButton variant="secondary" title={title}>
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
