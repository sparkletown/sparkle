import React, { FC, useState } from "react";
import {
  faChevronLeft,
  faChevronRight,
  faCog,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

import { TalkShowStudioVenue } from "types/venues";

import { WithId } from "utils/id";
import { currentVenueSelector } from "utils/selectors";

import { useSelector } from "hooks/useSelector";
import { useUser } from "hooks/useUser";

import { AdminPanel } from "./components/AdminPanel/AdminPanel";

import "./SettingsSidebar.scss";

export interface SettingsSidebarProps {
  venue: WithId<TalkShowStudioVenue>;
}

export const SettingsSidebar: FC<SettingsSidebarProps> = ({ venue }) => {
  const [isOpened, setIsOpened] = useState(false);
  const currentVenue = useSelector(currentVenueSelector);
  const { userId } = useUser();

  if (!(userId && currentVenue?.owners.includes(userId))) return null;

  const containerStyles = classNames("settings-sidebar", {
    "settings-sidebar--expanded": isOpened,
  });

  const controllerStyles = classNames("controller-closed", {
    "controller-opened": isOpened,
  });

  return (
    <div className={containerStyles}>
      <div className="header">
        <div
          className={controllerStyles}
          onClick={() => {
            setIsOpened(!isOpened);
          }}
        >
          {isOpened ? (
            <FontAwesomeIcon icon={faChevronRight} size="sm" />
          ) : (
            <>
              <FontAwesomeIcon icon={faChevronLeft} size="sm" />
              <div className="settings-sidebar__controller-wrapper">
                <FontAwesomeIcon
                  className="second-icon"
                  icon={faCog}
                  size="lg"
                />
                <span className="settings-sidebar__controller-text">
                  Settings
                </span>
              </div>
            </>
          )}
        </div>
        <div className="tab">Admin</div>
      </div>
      <div className="tab-content">
        <AdminPanel venue={venue} />
      </div>
    </div>
  );
};
