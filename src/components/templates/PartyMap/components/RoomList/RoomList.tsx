import React from "react";
import "./RoomList.scss";

import RoomCard from "../RoomCard";
import { ONE_MINUTE_IN_SECONDS } from "utils/time";
import {
  SubVenue,
  PartyMapEventSubVenue,
  PartyMapScheduleItem,
  isPartyMapEvent,
} from "types/PartyMapVenue";
import { WithId } from "utils/id";
import { VenueEvent } from "types/VenueEvent";
import { Venue } from "types/Venue";

interface PropsType {
  startUtcSeconds: number;
  subVenues: Array<WithId<SubVenue>>;
  childVenues: Array<WithId<Venue>>;
  attendances: Record<string, number>;
  setSelectedRoom: (venueId: string) => void;
  setIsRoomModalOpen: (value: boolean) => void;
  currentEvent: WithId<VenueEvent>;
}

/** COPIED FROM time.js and typed */

const getEventStartingTimeInSeconds = (
  event: PartyMapScheduleItem,
  startUtcSeconds: number
) => {
  return event.start_minute * ONE_MINUTE_IN_SECONDS + startUtcSeconds;
};

const getEventEndingTimeInSeconds = (
  event: PartyMapScheduleItem,
  startUtcSeconds: number
) => {
  return (
    (event.start_minute + event.duration_minutes) * ONE_MINUTE_IN_SECONDS +
    startUtcSeconds
  );
};
export const getCurrentEvent = (
  subVenue: PartyMapEventSubVenue,
  startUtcSeconds: number
) => {
  const currentTimeInSeconds = new Date().getTime() / 1000;
  return subVenue.schedule.find(
    (event) =>
      getEventStartingTimeInSeconds(event, startUtcSeconds) <=
        currentTimeInSeconds &&
      getEventEndingTimeInSeconds(event, startUtcSeconds) >=
        currentTimeInSeconds
  );
};

export const eventHappeningNow = (
  subVenue: PartyMapEventSubVenue,
  startUtcSeconds: number
) => {
  return !!getCurrentEvent(subVenue, startUtcSeconds);
};

const getCurrentOrFirstEvent = (
  subVenue: PartyMapEventSubVenue,
  startUtcSeconds: number
) => {
  return eventHappeningNow(subVenue, startUtcSeconds)
    ? getCurrentEvent(subVenue, startUtcSeconds)
    : subVenue.schedule.sort((e1, e2) =>
        e1.start_minute < e2.start_minute ? -1 : 1
      )?.[0];
};
/** END COPIED */

const RoomList: React.FunctionComponent<PropsType> = ({
  startUtcSeconds,
  subVenues,
  childVenues,
  attendances,
  setSelectedRoom,
  setIsRoomModalOpen,
  currentEvent,
}) => {
  if (!isPartyMapEvent(currentEvent)) {
    return <></>;
  }

  const toDisplaySubVenueIds = currentEvent.sub_venues
    .filter((partyMapEventSubVenue) =>
      eventHappeningNow(partyMapEventSubVenue, startUtcSeconds)
    )
    .map((v) => v.id);
  const displayedSubVenues = subVenues.filter((v) =>
    toDisplaySubVenueIds.includes(v.id)
  );

  const openModal = (subVenue: WithId<SubVenue>) => {
    setSelectedRoom(subVenue.id);
    setIsRoomModalOpen(true);
  };

  return (
    <>
      <div>
        <h5>{`What's on now: ${displayedSubVenues.length} rooms open`}</h5>
      </div>
      <div className="rooms-container">
        {displayedSubVenues.map((subVenue) => (
          <RoomCard
            key={subVenue.id}
            startUtcSeconds={startUtcSeconds}
            subVenue={subVenue}
            childVenue={childVenues.find((v) => v.id === subVenue.id)}
            displayedEvent={getCurrentOrFirstEvent(
              currentEvent.sub_venues.filter(({ id }) => id === subVenue.id)[0],
              startUtcSeconds
            )}
            attendance={attendances[subVenue.id]}
            onClick={() => openModal(subVenue)}
          />
        ))}
      </div>
    </>
  );
};

export default RoomList;
