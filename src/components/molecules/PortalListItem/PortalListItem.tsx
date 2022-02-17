import React from "react";
import classNames from "classnames";

import { ALWAYS_NOOP_FUNCTION, PortalInfoItem } from "settings";

import { useKeyPress } from "hooks/useKeyPress";

import "./PortalListItem.scss";

const HANDLED_KEY_PRESSES = ["Space", "Enter"];

interface PortalListItemProps {
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
    "bg-gray-200": selected,
    hidden: hidden,
  });

  const handleKeyPress = useKeyPress({
    keys: HANDLED_KEY_PRESSES,
    onPress: onClick ?? ALWAYS_NOOP_FUNCTION,
  });

  const itemClasses =
    "flex items-center space-x-4 py-4 my-0 hover:bg-gray-100 hover:rounded active:bg-gray-200 selected:bg-gray-200 cursor-pointer";
  const iconClasses = "h-8 w-8 rounded-full bg-black";
  const nameClasses = "text-sm font-medium text-gray-900 truncate";

  // NOTE: tabIndex allows tab behavior, @see https://allyjs.io/data-tables/focusable.html
  return (
    <div className={parentClasses}>
      <div
        className={itemClasses}
        key={template}
        onClick={onClick}
        onKeyPress={handleKeyPress}
        tabIndex={tabIndex}
      >
        <img className={iconClasses} src={icon} alt={template} />
        <div className={nameClasses}>{text}</div>
      </div>
    </div>
  );
};
