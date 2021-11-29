import React, { KeyboardEventHandler, useCallback } from "react";
import classNames from "classnames";

import { PortalInfoListItem, ROOM_TAXON } from "settings";

import "./PortalListItem.scss";

export interface PortalListItemProps {
  item: PortalInfoListItem;
  selected?: boolean;
  tabIndex: number;
  onClick?: () => void;
}

export const PortalListItem: React.FC<PortalListItemProps> = ({
  item,
  selected,
  tabIndex,
  onClick,
}) => {
  const { text, template, icon, hidden } = item;

  const parentClasses = classNames({
    [`PortalListItem PortalListItem--${template}`]: true,
    "PortalListItem--selected": selected,
    "mod--hidden": hidden,
  });

  const handleKeyPress: KeyboardEventHandler<HTMLDivElement> = useCallback(
    ({ code }) => {
      if (code !== "Space" && code !== "Enter") return;
      onClick?.();
    },
    [onClick]
  );

  // NOTE: tabIndex allows tab behavior, @see https://allyjs.io/data-tables/focusable.html
  return (
    <div className={parentClasses}>
      <div
        className="PortalListItem__list-item"
        onClick={onClick}
        onKeyPress={handleKeyPress}
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
