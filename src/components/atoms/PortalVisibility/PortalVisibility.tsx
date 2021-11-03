import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

import { LABEL_VISIBILITY_OPTIONS } from "settings";

import { RoomVisibility } from "types/venues";

import "./PortalVisibility.scss";
export interface PortalVisibilityProps {
  updateRoomVisibility: Dispatch<SetStateAction<RoomVisibility | undefined>>;
  visibilityState: RoomVisibility | undefined;
}

export const PortalVisibility: React.FC<PortalVisibilityProps> = ({
  updateRoomVisibility,
  visibilityState,
}) => {
  const [selectedVisibility, updateVisibility] = useState<
    RoomVisibility | undefined
  >(visibilityState);

  useEffect(() => {
    if (selectedVisibility) {
      updateRoomVisibility(selectedVisibility);
    }
  }, [updateRoomVisibility, selectedVisibility]);

  const renderedPortalItems = useMemo(() => {
    const visibilityOptionArray = Object.values(LABEL_VISIBILITY_OPTIONS);

    return visibilityOptionArray.map(({ subtitle, label, value }) => {
      const portalStatusClasses = classNames("PortalVisibility__item", {
        "PortalVisibility__item--selected":
          selectedVisibility && selectedVisibility === value,
      });

      return (
        <div
          key={label}
          onClick={() => updateVisibility(value)}
          className={portalStatusClasses}
        >
          <div className="PortalVisibility__item-image">
            {subtitle && (
              <div className="PortalVisibility__item-subtitle">
                {subtitle.map(({ text, icon }, index) => (
                  <div
                    key={`${text}-${index}`}
                    className="PortalVisibility__item-subtitle-item"
                  >
                    <FontAwesomeIcon icon={icon} />
                    <span className="PortalVisibility__item-subtitle-item-text">
                      {text}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          {label}
        </div>
      );
    });
  }, [selectedVisibility]);

  return <div className="PortalVisibility">{renderedPortalItems}</div>;
};
