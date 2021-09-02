import React, { useCallback, useMemo } from "react";

import { DEFAULT_SHOW_SCHEDULE } from "settings";

import { retainAttendance } from "store/actions/Attendance";

import { Room } from "types/rooms";
import { User } from "types/User";
import { VenueEvent } from "types/venues";

import { WithId, WithVenueId } from "utils/id";
import { getLastUrlParam, getUrlWithoutTrailingSlash } from "utils/url";

import { useCustomSound } from "hooks/sounds";
import { useDispatch } from "hooks/useDispatch";
import { useRelatedVenues } from "hooks/useRelatedVenues";
import { useRoom } from "hooks/useRoom";

import { ScheduleItem } from "components/templates/PartyMap/components";

import { RenderMarkdown } from "components/organisms/RenderMarkdown";

import { UserList } from "components/molecules/UserList";

import "./RoomDetails.scss";

export interface RoomDetailsProps {
  room: Room;
  venueId: string;
  venueName: string;
  venueEvents: WithVenueId<WithId<VenueEvent>>[];
  showEvents: boolean;
}

export const RoomDetails: React.FC<RoomDetailsProps> = ({
  room,
  venueName,
  venueId,
  venueEvents,
  showEvents = DEFAULT_SHOW_SCHEDULE,
}) => {
  const dispatch = useDispatch();

  // @debt do we need to keep this retainAttendance stuff (for counting feature), or is it legacy tech debt?
  const triggerAttendance = useCallback(() => {
    dispatch(retainAttendance(true));
  }, [dispatch]);

  // @debt do we need to keep this retainAttendance stuff (for counting feature), or is it legacy tech debt?
  const clearAttendance = useCallback(() => {
    dispatch(retainAttendance(false));
  }, [dispatch]);

  const { findVenueInRelatedVenues } = useRelatedVenues({
    currentVenueId: venueId,
  });

  const noTrailSlashPortalUrl = getUrlWithoutTrailingSlash(room.url);

  const [portalVenueId] = getLastUrlParam(noTrailSlashPortalUrl);
  const portalVenue = findVenueInRelatedVenues(portalVenueId);

  const portalVenueSubtitle = portalVenue?.config?.landingPageConfig?.subtitle;
  const portalVenueDescription =
    portalVenue?.config?.landingPageConfig?.description;

  const { enterRoom, recentRoomUsers } = useRoom({ room, venueName });
  const userList = recentRoomUsers as readonly WithId<User>[];

  const [_enterRoomWithSound] = useCustomSound(room.enterSound, {
    interrupt: true,
    onend: enterRoom,
  });

  // note: this is here just to change the type on it in an easy way
  const enterRoomWithSound: () => void = useCallback(_enterRoomWithSound, [
    _enterRoomWithSound,
  ]);

  const renderedRoomEvents = useMemo(() => {
    if (!showEvents) return [];

    return venueEvents.map((event, index: number) => (
      <ScheduleItem
        // @debt Ideally event.id would always be a unique identifier, but our types suggest it
        //   can be undefined. Because we can't use index as a key by itself (as that is unstable
        //   and causes rendering issues, we construct a key that, while not guaranteed to be unique,
        //   is far less likely to clash
        key={event.id ?? `${event.room}-${event.name}-${index}`}
        event={event}
        enterEventLocation={enterRoomWithSound}
      />
    ));
  }, [enterRoomWithSound, showEvents, venueEvents]);

  const showRoomEvents = showEvents && renderedRoomEvents.length > 0;

  const iconStyles = {
    backgroundImage: room.image_url ? `url(${room.image_url})` : undefined,
  };

  const roomTitle = room.title || portalVenue?.name;
  const roomSubtitle = room.subtitle || portalVenueSubtitle;
  const roomDescription = room.about || portalVenueDescription;

  return (
    <div className="RoomDetails">
      <div className="RoomDetails__main">
        <div className="RoomDetails__icon" style={iconStyles} />

        <div className="RoomDetails__content">
          <div className="RoomDetails__title">{roomTitle}</div>

          {roomSubtitle && (
            <div className="RoomDetails__subtitle">{roomSubtitle}</div>
          )}

          {/* @debt extract this 'enter room' button/link concept into a reusable component */}
          {/* @debt convert this to an <a> tag once blockers RE: counting/user presence are solved, see https://github.com/sparkletown/sparkle/issues/1670 */}
          <button
            className="btn btn-primary RoomDetails__btn-enter"
            onMouseOver={triggerAttendance}
            onMouseOut={clearAttendance}
            onClick={enterRoomWithSound}
          >
            Join Room
          </button>
        </div>
      </div>

      {room.about && (
        <div className="RoomDetails__description">
          <RenderMarkdown text={roomDescription} />
        </div>
      )}

      <UserList
        containerClassName="RoomDetails__userlist"
        users={userList}
        limit={11}
        activity="in here"
        hasClickableAvatars
      />

      {showRoomEvents && (
        <div className="RoomDetails__events">{renderedRoomEvents}</div>
      )}
    </div>
  );
};
