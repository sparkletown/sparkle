import React, { useCallback, useState } from "react";
import classNames from "classnames";

import { currentVenueSelectorData, parentVenueSelector } from "utils/selectors";

import { useSelector } from "hooks/useSelector";

import { SchedulePageModal } from "components/organisms/SchedulePageModal/SchedulePageModal";

import "./NavbarSchedule.scss";

export const NavbarSchedule: React.FC = () => {
  const venue = useSelector(currentVenueSelectorData);
  const parentVenue = useSelector(parentVenueSelector);

  const [isEventScheduleVisible, setEventScheduleVisible] = useState(false);

  const toggleEventSchedule = useCallback(() => {
    setEventScheduleVisible((scheduleVisible) => !scheduleVisible);
  }, []);

  const hideEventSchedule = useCallback(() => {
    setEventScheduleVisible(false);
  }, []);

  // TODO: ideally this would find the top most parent of parents and use those details
  const navbarTitle = parentVenue?.name ?? venue?.name ?? "";

  return (
    <>
      <div
        className={classNames("nav-party-logo", {
          "nav-party-logo--visible": isEventScheduleVisible,
        })}
        onClick={toggleEventSchedule}
      >
        {navbarTitle} Schedule
      </div>
      <div
        className={classNames("schedule-dropdown-backdrop", {
          "schedule-dropdown-backdrop--visible": isEventScheduleVisible,
        })}
        onClick={hideEventSchedule}
      >
        <SchedulePageModal isVisible={isEventScheduleVisible} />
      </div>
    </>
  );
};
