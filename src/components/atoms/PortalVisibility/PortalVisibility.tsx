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
  visibilityState: RoomVisibility | undefined;
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
      {LABEL_VISIBILITY_OPTIONS.map((el) => {
        const visibilitySubtitle = el?.subtitle?.split(", ");
        return (
          <div
            key={el.label}
            onClick={() => updateVisibility(el.value)}
            className={`PortalVisibility__item ${
              selectedVisibility && selectedVisibility === el.value
                ? "PortalVisibility__item--selected"
                : ""
            }`}
          >
            <div className="PortalVisibility__item-image">
              {!!visibilitySubtitle?.length && (
                <div className="PortalVisibility__item-subtitle">
                  {visibilitySubtitle?.map((el) => (
                    <div
                      key={el}
                      className="PortalVisibility__item-subtitle-item"
                    >
                      <FontAwesomeIcon
                        icon={el === "Venue title" ? solidSun : solidUsers}
                      />
                      <span className="PortalVisibility__item-subtitle-item-text">
                        {el}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {el.label}
          </div>
        );
      })}
    </div>
  );
};
