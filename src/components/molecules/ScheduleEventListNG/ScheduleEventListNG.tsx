import React, { useEffect, useMemo, useState } from "react";
import isToday from "date-fns/isToday";

import { EVENT_STATUS_REFRESH_MS } from "settings";

import { ScheduledVenueEvent } from "types/venues";

import {
  augmentEventWithAudience,
  isEventLater,
  isEventLive,
  isEventSoon,
} from "utils/event";
import { formatDateRelativeToNow } from "utils/time";

import { useInterval } from "hooks/useInterval";
import { useRelatedVenues } from "hooks/useRelatedVenues";
import { useRoomRecentUsersList } from "hooks/useRoomRecentUsersList";

import { ScheduleEventSubListNG } from "./ScheduleEventSubListNG";

import "./ScheduleEventListNG.scss";

export interface ScheduleEventListNGProps {
  daysEvents: ScheduledVenueEvent[];
  scheduleDate: Date;
  venueId: string;
}

export const ScheduleEventListNG: React.FC<ScheduleEventListNGProps> = ({
  daysEvents,
  scheduleDate,
  venueId,
}) => {
  const isTodayDate = isToday(scheduleDate);
  const [allEvents, setAllEvents] = useState(daysEvents);

  useInterval(() => setAllEvents([...allEvents]), EVENT_STATUS_REFRESH_MS);

  useEffect(() => {
    setAllEvents([...daysEvents]);
  }, [daysEvents, setAllEvents]);

  const { currentVenue } = useRelatedVenues({
    currentVenueId: venueId,
  });
  const roomList = allEvents.map((el) => {
    const [roomData] =
      currentVenue?.rooms?.filter((room) => room.title === el?.room) || [];
    return roomData;
  });

  const recentRoomUsers = useRoomRecentUsersList({ roomList });

  const eventsWithAudience = useMemo(
    () => augmentEventWithAudience(allEvents, recentRoomUsers),
    [allEvents, recentRoomUsers]
  );

  const liveEvents = useMemo(() => eventsWithAudience.filter(isEventLive), [
    eventsWithAudience,
  ]);
  const comingSoonEvents = useMemo(() => allEvents.filter(isEventSoon), [
    allEvents,
  ]);
  const laterEvents = useMemo(() => allEvents.filter(isEventLater), [
    allEvents,
  ]);

  if (!isTodayDate) {
    return (
      <div className="ScheduleEventListNG">
        <ScheduleEventSubListNG
          events={daysEvents}
          title={`Events on ${formatDateRelativeToNow(scheduleDate)}`}
        />
      </div>
    );
  }

  return (
    <div className="ScheduleEventListNG">
      <ScheduleEventSubListNG
        events={liveEvents}
        title="What’s on now"
        isLive
      />
      <ScheduleEventSubListNG events={comingSoonEvents} title="Starting soon" />
      <ScheduleEventSubListNG events={laterEvents} title="More events today" />
    </div>
  );
};
