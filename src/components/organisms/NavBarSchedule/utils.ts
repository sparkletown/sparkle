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

export const prepareForSchedule = (
  day: Date,
  usersEvents: MyPersonalizedSchedule,
  target: string
) => (event: WithVenueId<VenueEvent>): PersonalizedVenueEvent => {
  let startOfEventToShow;
  let endOfEventToShow;

  if (target === "calender") {
    startOfEventToShow = eventStartTime(event);
    endOfEventToShow = eventEndTime(event);
  } else {
    startOfEventToShow = max([eventStartTime(event), startOfDay(day)]);
    endOfEventToShow = min([eventEndTime(event), endOfDay(day)]);
  }

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
