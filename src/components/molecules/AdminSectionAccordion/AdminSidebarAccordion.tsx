import React from "react";
import { faCaretDown, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

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
  const { isShown, toggle } = useShowHide(open);

  const parentClasses = classNames({
    AdminSidebarAccordion: true,
    "AdminSidebarAccordion--open": isShown,
    "AdminSidebarAccordion--closed": !isShown,
  });

  return (
    <section className={parentClasses}>
      <span className="AdminSidebarAccordion__title" onClick={toggle}>
        {title}
        <FontAwesomeIcon
          className="AdminSidebarAccordion__icon"
          icon={isShown ? faCaretDown : faCaretRight}
        />
      </span>
      <div className="AdminSidebarAccordion__contents-wrapper">
        <div className="AdminSidebarAccordion__contents">{children}</div>
      </div>
    </section>
  );
};
