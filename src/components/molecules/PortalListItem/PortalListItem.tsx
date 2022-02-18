import React from "react";
import classNames from "classnames";

import { ALWAYS_NOOP_FUNCTION, PortalInfoItem } from "settings";

import { useKeyPress } from "hooks/useKeyPress";

import * as TW from "./PortalListItem.tailwind";

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
    [TW.selectedItem]: selected,
    hidden: hidden,
  });

  const handleKeyPress = useKeyPress({
    keys: HANDLED_KEY_PRESSES,
    onPress: onClick ?? ALWAYS_NOOP_FUNCTION,
  });

  // NOTE: tabIndex allows tab behavior, @see https://allyjs.io/data-tables/focusable.html
  return (
    <div className={parentClasses}>
      <div
        className={TW.portalItem}
        key={template}
        onClick={onClick}
        onKeyPress={handleKeyPress}
        tabIndex={tabIndex}
      >
        <img className={TW.icon} src={icon} alt={template} />
        <div className={TW.name}>{text}</div>
      </div>
    </div>
  );
};
