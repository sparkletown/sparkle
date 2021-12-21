import React from "react";
import { faCaretDown, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useShowHide } from "hooks/useShowHide";

import "./AdminSidebarAccordion.scss";

interface AdminSidebarAccordionProps {
  title: string;
  open?: boolean;
}

export const AdminSidebarAccordion: React.FC<AdminSidebarAccordionProps> = ({
  title,
  open = false,
  children,
}) => {
  const { isShown: showListItem, toggle: toggleShowListItem } = useShowHide(
    open
  );

  return (
    <section className="AdminSidebarAccordion">
      <span
        className="AdminSidebarAccordion__title"
        onClick={toggleShowListItem}
      >
        {title}
        <FontAwesomeIcon
          className="AdminSidebarAccordion__icon"
          icon={showListItem ? faCaretDown : faCaretRight}
        />
      </span>
      <div className="AdminSidebarAccordion__contents">
        {showListItem && children}
      </div>
    </section>
  );
};
