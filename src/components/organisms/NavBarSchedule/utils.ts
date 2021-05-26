import {
  differenceInMinutes,
  endOfDay,
  getUnixTime,
  max,
  min,
  startOfDay,
} from "date-fns";

import { PersonalizedVenueEvent, VenueEvent } from "types/venues";
import { MyPersonalizedSchedule } from "types/User";

import { WithVenueId } from "utils/id";
import { eventEndTime, eventStartTime } from "utils/event";
import { isTruthy } from "utils/types";

export interface PrepareForScheduleProps {
  day: Date;
  usersEvents: MyPersonalizedSchedule;
  isForCalendarFile: boolean;
}

export const prepareForSchedule = ({
  day,
  usersEvents,
  isForCalendarFile,
}: PrepareForScheduleProps) => (
  event: WithVenueId<VenueEvent>
): PersonalizedVenueEvent => {
  const startOfEventToShow = isForCalendarFile
    ? eventStartTime(event)
    : max([eventStartTime(event), startOfDay(day)]);
  const endOfEventToShow = isForCalendarFile
    ? eventEndTime(event)
    : min([eventEndTime(event), endOfDay(day)]);

  return {
    ...event,
    start_utc_seconds: getUnixTime(startOfEventToShow),
    duration_minutes: differenceInMinutes(endOfEventToShow, startOfEventToShow),
    isSaved: isTruthy(
      event.id && usersEvents[event.venueId]?.includes(event.id)
    ),
  };
};

export const buildLocationString = (event: WithVenueId<VenueEvent>) =>
  `${event.venueId}#${event.room ?? ""}`;

export const extractLocation = (locationStr: string) =>
  locationStr.split("#", 2);
