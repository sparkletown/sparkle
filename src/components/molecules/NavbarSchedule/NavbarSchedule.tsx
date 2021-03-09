import React, { useCallback, useState } from "react";
import classNames from "classnames";

import { SchedulePageModal } from "components/organisms/SchedulePageModal/SchedulePageModal";
import { useSelector } from "hooks/useSelector";
import { currentVenueSelectorData, parentVenueSelector } from "utils/selectors";

export const NavbarSchedule = () => {
  const venue = useSelector(currentVenueSelectorData);
  const parentVenue = useSelector(parentVenueSelector);

  const [isEventScheduleVisible, setEventScheduleVisible] = useState(false);

  const toggleEventSchedule = useCallback(() => {
    setEventScheduleVisible(!isEventScheduleVisible);
  }, [isEventScheduleVisible]);

  const hideEventSchedule = useCallback(() => {
    setEventScheduleVisible(false);
  }, []);

  const navbarTitle = parentVenue?.name ?? venue?.name;

  return (
    <>
      <div
        className={classNames("nav-party-logo", {
          clicked: isEventScheduleVisible,
        })}
        onClick={toggleEventSchedule}
      >
        {navbarTitle} Schedule
      </div>
      <div
        className={classNames("schedule-dropdown-backdrop", {
          show: isEventScheduleVisible,
        })}
        onClick={hideEventSchedule}
      >
        <SchedulePageModal isVisible={isEventScheduleVisible} />
      </div>
    </>
  );
};
