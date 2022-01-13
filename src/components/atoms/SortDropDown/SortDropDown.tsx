import React from "react";

import { SortingOptions } from "utils/venue";

import { Dropdown } from "components/atoms/Dropdown";

import "./SortDropDown.scss";

interface SortDropDownProps {
  onClick: (value: SortingOptions) => void;
  title: string;
}

export const SortDropDown: React.FC<SortDropDownProps> = ({
  onClick,
  title,
}) => {
  const name = { value: title, label: title };
  const options = Object.values(SortingOptions).map((sortingOption) => ({
    value: sortingOption,
    label: (
      <div
        key={sortingOption}
        onClick={() => onClick(sortingOption)}
        className="SortDropDown__option"
      >
        {sortingOption}
      </div>
    ),
  }));

  return (
    <div className="SortDropDown">
      <Dropdown title={name} options={options} />
    </div>
  );
};
