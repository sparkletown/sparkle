import React from "react";
import { faCaretDown, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

import { useShowHide } from "hooks/useShowHide";

import "./AdminSpacesListItem.scss";

export interface AdminSpacesListItemProps {
  className?: string;
  title: string;
}

export const AdminSpacesListItem: React.FC<AdminSpacesListItemProps> = ({
  className,
  title,
  children,
}) => {
  const { isShown: showListItem, toggle: toggleShowListItem } = useShowHide(
    false
  );
  const containerClasses = classNames("AdminSpacesListItem", className);
  return (
    <>
      <div className={containerClasses} onClick={toggleShowListItem}>
        <div>{title}</div>
        <FontAwesomeIcon icon={showListItem ? faCaretDown : faCaretRight} />
      </div>
      {showListItem && children}
    </>
  );
};
