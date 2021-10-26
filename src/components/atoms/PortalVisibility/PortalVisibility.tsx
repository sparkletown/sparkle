import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  faSun as solidSun,
  faUserFriends as solidUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// import { useForm } from "react-hook-form";
import { LABEL_VISIBILITY_OPTIONS } from "settings";

import { RoomVisibility } from "types/venues";

import "./PortalVisibility.scss";
export interface PortalVisibilityProps {
  updateRoomVisibility: Dispatch<SetStateAction<RoomVisibility | undefined>>;
  visibilityState?: RoomVisibility | undefined;
}

export const labelOptions = LABEL_VISIBILITY_OPTIONS;

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

  return (
    <div className="PortalVisibility">
      {LABEL_VISIBILITY_OPTIONS.map(({ subtitle, label, value }) => {
        const visibilitySubtitleArray = subtitle?.split(", ");

        const portalStatusClasses =
          selectedVisibility && selectedVisibility === value
            ? "PortalVisibility__item--selected"
            : "";

        return (
          <div
            key={label}
            onClick={() => updateVisibility(value)}
            className={`PortalVisibility__item ${portalStatusClasses}`}
          >
            <div className="PortalVisibility__item-image">
              {!!visibilitySubtitleArray?.length && (
                <div className="PortalVisibility__item-subtitle">
                  {visibilitySubtitleArray?.map((visibilitySubtitleText) => (
                    <div
                      key={visibilitySubtitleText}
                      className="PortalVisibility__item-subtitle-item"
                    >
                      <FontAwesomeIcon
                        icon={
                          visibilitySubtitleText === "Venue title"
                            ? solidSun
                            : solidUsers
                        }
                      />
                      <span className="PortalVisibility__item-subtitle-item-text">
                        {visibilitySubtitleText}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {label}
          </div>
        );
      })}
    </div>
  );
};
