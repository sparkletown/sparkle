import React from "react";
import classNames from "classnames";

import { ALWAYS_NOOP_FUNCTION, PortalInfoItem, ROOM_TAXON } from "settings";

import { useKeyPress } from "hooks/useKeyPress";

import "./PortalListItem.scss";

const HANDLED_KEY_PRESSES = ["Space", "Enter"];

export interface PortalListItemProps {
  item: PortalInfoItem;
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

  const handleKeyPress = useKeyPress({
    keys: HANDLED_KEY_PRESSES,
    onPress: onClick ?? ALWAYS_NOOP_FUNCTION,
  });

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
