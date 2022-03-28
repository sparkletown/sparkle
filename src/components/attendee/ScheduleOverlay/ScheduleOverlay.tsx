import React, { useMemo, useState } from "react";
import { Toggler } from "components/attendee/Toggler";
import { fromUnixTime, isToday, startOfDay, startOfToday } from "date-fns";

import { ALWAYS_EMPTY_OBJECT, WORLD_TAXON } from "settings";

import { useWorldAndSpaceByParams } from "hooks/spaces/useWorldAndSpaceByParams";
import { useShowHide } from "hooks/useShowHide";
import { useUser } from "hooks/useUser";
import useVenueScheduleEvents from "hooks/useVenueScheduleEvents";

import { Loading } from "components/molecules/Loading";

import { ScheduleEvents } from "./ScheduleEvents";
import { ScrollableWeekdays } from "./ScrollableWeekdays";
import { Weekdays } from "./Weekdays";

import CN from "./ScheduleOverlay.module.scss";

const minWeekDaysScrollValue = 8;

export const ScheduleOverlay: React.FC = () => {
  const { world } = useWorldAndSpaceByParams();
  const { userWithId } = useUser();
  const userEventIds =
    userWithId?.myPersonalizedSchedule ?? ALWAYS_EMPTY_OBJECT;

  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  const {
    isShown: showPersonalisedSchedule,
    toggle: togglePersonalisedSchedule,
  } = useShowHide(false);

  const { dayDifference, sovereignVenue } = useVenueScheduleEvents({
    userEventIds,
  });

  const scheduledStartDate = sovereignVenue?.start_utc_seconds;

  // @debt: probably will need to be re-calculated based on minDateUtcSeconds instead of startOfDay.Check later
  const firstDayOfSchedule = useMemo(() => {
    return scheduledStartDate
      ? startOfDay(fromUnixTime(scheduledStartDate))
      : startOfToday();
  }, [scheduledStartDate]);

  const isScheduleTimeshifted = !isToday(firstDayOfSchedule);

  const { isEventsLoading } = useVenueScheduleEvents({ userEventIds });

  return (
    <div className={CN.scheduleOverlayWrapper}>
      <div className={CN.scheduleOverlayHeader}>
        {world?.name || WORLD_TAXON.title} schedule
      </div>
      <Toggler
        containerClassName={CN.scheduleOverlayButton}
        toggled={showPersonalisedSchedule}
        onChange={togglePersonalisedSchedule}
        title="Only show bookmarked events"
      />
      {dayDifference <= minWeekDaysScrollValue ? (
        <Weekdays
          onIndexSelect={setSelectedDayIndex}
          selectedDayIndex={selectedDayIndex}
          isScheduleTimeshifted={isScheduleTimeshifted}
        />
      ) : (
        <ScrollableWeekdays
          onIndexSelect={setSelectedDayIndex}
          selectedDayIndex={selectedDayIndex}
          dayDifference={dayDifference}
          isScheduleTimeshifted={isScheduleTimeshifted}
        />
      )}

      {isEventsLoading && (
        <Loading
          containerClassName="Schedule__loading"
          label="Events are loading"
        />
      )}
      <ScheduleEvents
        showPersonalisedSchedule={showPersonalisedSchedule}
        selectedDayIndex={selectedDayIndex}
      />
    </div>
  );
};
