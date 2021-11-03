import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  faSun as solidSun,
  faUserFriends as solidUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

import { LABEL_VISIBILITY_OPTIONS } from "settings";
import { SPACE_TAXON } from "settings/taxonomy";

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
    return LABEL_VISIBILITY_OPTIONS.map(({ subtitle, label, value }) => {
      const visibilitySubtitleArray = subtitle?.split(", ");

      const portalStatusClasses = classNames("PortalVisibility__item", {
        "PortalVisibility__item--selected":
          selectedVisibility && selectedVisibility === value,
      });

      const hasSubtitles = !!visibilitySubtitleArray?.length;

      return (
        <div
          key={label}
          onClick={() => updateVisibility(value)}
          className={portalStatusClasses}
        >
          <div className="PortalVisibility__item-image">
            {hasSubtitles && (
              <div className="PortalVisibility__item-subtitle">
                {visibilitySubtitleArray?.map((visibilitySubtitleText) => {
                  const isIconSun =
                    visibilitySubtitleText === SPACE_TAXON.title;

                  return (
                    <div
                      key={visibilitySubtitleText}
                      className="PortalVisibility__item-subtitle-item"
                    >
                      <FontAwesomeIcon
                        icon={isIconSun ? solidSun : solidUsers}
                      />
                      <span className="PortalVisibility__item-subtitle-item-text">
                        {visibilitySubtitleText}
                      </span>
                    </div>
                  );
                })}
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
