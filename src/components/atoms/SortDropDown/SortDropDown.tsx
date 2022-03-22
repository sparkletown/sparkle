import React from "react";
import { Dropdown } from "components/admin/Dropdown";

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
    <Dropdown title={title}>
      {Object.values(SortingOptions).map((key) => (
        <div
          key={key}
          className="SortDropDown__option"
          onClick={() => onClick(key)}
          data-dropdown-value={key}
        >
          {key}
        </div>
      ))}
    </Dropdown>
  </div>
);
