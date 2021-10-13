import React from "react";
import { faCaretDown, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useShowHide } from "hooks/useShowHide";

import "./AdminSpacesListItem.scss";

export interface AdminSpacesListItemProps {
  title: string;
  isOpened?: boolean;
}

export const AdminSpacesListItem: React.FC<AdminSpacesListItemProps> = ({
  title,
  isOpened,
  children,
}) => {
  const { isShown: showListItem, toggle: toggleShowListItem } = useShowHide(
    isOpened ?? false
  );

  return (
    <section className="AdminSpacesListItem">
      <label
        className="AdminSpacesListItem__label"
        onClick={toggleShowListItem}
      >
        {title}
        <FontAwesomeIcon className="AdminSpacesListItem__icon" icon={showListItem ? faCaretDown : faCaretRight} />
      </label>
      {showListItem && children}
    </section>
  );
};
