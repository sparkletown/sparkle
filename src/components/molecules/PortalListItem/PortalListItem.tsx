import React from "react";
import classNames from "classnames";

import { ROOM_TAXON, SpacePortalsListItem } from "settings";

import "./PortalListItem.scss";

export interface PortalListItemProps {
  item: SpacePortalsListItem;
  tabIndex: number;
  onClick?: () => void;
}

export const PortalListItem: React.FC<PortalListItemProps> = ({
  item,
  tabIndex,
  onClick,
}) => {
  const { text, template, icon, hidden } = item;

  const parentClasses = classNames({
    [`PortalListItem PortalListItem--${template}`]: true,
    "mod--hidden": hidden,
  });

  // NOTE: tabIndex allows tab behavior, @see https://allyjs.io/data-tables/focusable.html
  return (
    <div className={parentClasses}>
      <div
        className="PortalListItem__list-item"
        onClick={onClick}
        tabIndex={tabIndex}
      >
        <img
          className="PortalListItem__icon"
          alt={`${ROOM_TAXON.lower} icon`}
          src={icon}
        />
        <div className="PortalListItem__name">{text}</div>
      </div>
    </div>
  );
};
