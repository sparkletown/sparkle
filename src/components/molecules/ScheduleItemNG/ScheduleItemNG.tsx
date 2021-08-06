import React, { useCallback, useMemo, MouseEventHandler } from "react";
import classNames from "classnames";
import { differenceInCalendarDays } from "date-fns";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark as regularBookmark } from "@fortawesome/free-regular-svg-icons";
import { faBookmark as solidBookmark } from "@fortawesome/free-solid-svg-icons";

import { EVENT_LIVE_RANGE } from "settings";

import { PersonalizedVenueEvent } from "types/venues";
import { Room } from "types/rooms";

import { eventEndTime, eventStartTime, isEventStartingSoon } from "utils/event";
import { formatDateRelativeToNow, formatTimeLocalised } from "utils/time";
import {
  enterVenue,
  openUrl,
  getUrlParamFromString,
  getUrlWithoutTrailingSlash,
  getLastUrlParam,
  getFullVenueInsideUrl,
} from "utils/url";

import { useShowHide } from "hooks/useShowHide";
import { useRelatedVenues } from "hooks/useRelatedVenues";
import { useRoom } from "hooks/useRoom";
import { useUser } from "hooks/useUser";

import { RenderMarkdown } from "components/organisms/RenderMarkdown";

import { ButtonNG } from "components/atoms/ButtonNG/ButtonNG";

import {
  addEventToPersonalizedSchedule,
  removeEventFromPersonalizedSchedule,
} from "api/profile";

import "./ScheduleItemNG.scss";

export interface ScheduleItemNGProps {
  event: PersonalizedVenueEvent;
}

export const ScheduleItemNG: React.FC<ScheduleItemNGProps> = ({ event }) => {
  const { currentVenue: eventVenue } = useRelatedVenues({
    currentVenueId: event.venueId,
  });
  const eventRoom = useMemo<Room | undefined>(
    () =>
      eventVenue?.rooms?.find((room) => {
        const { room: eventRoom = "" } = event;
        const noTrailSlashUrl = getUrlWithoutTrailingSlash(room.url);

        const [roomName] = getLastUrlParam(noTrailSlashUrl);
        const roomUrlParam = getUrlParamFromString(eventRoom);
        const selectedRoom = getUrlParamFromString(room.title) === eventRoom;

        return roomUrlParam.endsWith(`${roomName}`) || selectedRoom;
      }),
    [eventVenue, event]
  );
  const { isShown: isEventExpanded, toggle: toggleEventExpand } = useShowHide();
  const { enterRoom } = useRoom({
    room: eventRoom,
    venueName: eventVenue?.name ?? "",
  });
  const showDate = Boolean(
    differenceInCalendarDays(eventEndTime(event), eventStartTime(event))
  );
  const isCurrentEventLive = isEventStartingSoon(event, 2 * EVENT_LIVE_RANGE);
  const roomUrlParam = getUrlParamFromString(event.room ?? "");

  const handleCopyEventLink = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      const eventLink = getFullVenueInsideUrl(roomUrlParam);
      navigator.clipboard.writeText(eventLink);
    },
    [roomUrlParam]
  );

  const goToEventLocation = useCallback(() => {
    if (!eventRoom) {
      openUrl(roomUrlParam);

      return;
    }

    if (event.room) {
      enterRoom();
    } else {
      enterVenue(event.venueId);
    }
  }, [enterRoom, event, eventRoom, roomUrlParam]);

  const infoContaier = classNames("ScheduleItemNG__info", {
    "ScheduleItemNG__info--active": isCurrentEventLive,
  });

  const timeContainer = classNames("ScheduleItemNG__time", {
    "ScheduleItemNG__time--live": isCurrentEventLive,
  });

  const { userId } = useUser();

  const bookmarkEvent: MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      if (!userId || !event.id) return;

      e.stopPropagation();

      event.isSaved
        ? removeEventFromPersonalizedSchedule({ event, userId })
        : addEventToPersonalizedSchedule({ event, userId });
    },
    [userId, event]
  );

  return (
    <div className="ScheduleItemNG" onClick={toggleEventExpand}>
      <div className={infoContaier}>
        <span className="ScheduleItemNG__date">
          {!isCurrentEventLive &&
            showDate &&
            formatDateRelativeToNow(eventStartTime(event))}
        </span>

        <span className={timeContainer}>
          {isCurrentEventLive
            ? "Live"
            : formatTimeLocalised(eventStartTime(event))}
        </span>

        <span className="ScheduleItemNG__date ScheduleItemNG__time--end">
          {showDate && formatDateRelativeToNow(eventEndTime(event))}
        </span>

        <span className="ScheduleItemNG__time ScheduleItemNG__time--end">
          {formatTimeLocalised(eventEndTime(event))}
        </span>
      </div>
      <div className="ScheduleItemNG__details">
        <div className="ScheduleItemNG__name">{event.name}</div>
        <div className="ScheduleItemNG__place">
          <span className="ScheduleItemNG__place--location">in</span>{" "}
          {event.room}
        </div>
        {isEventExpanded && (
          <>
            <div className="ScheduleItemNG__description">
              <RenderMarkdown text={event.description} />
            </div>
            <div className="ScheduleItemNG__buttons">
              <ButtonNG
                className="ScheduleItemNG__button ScheduleItemNG__button--copy"
                onClick={handleCopyEventLink}
                variant="secondary"
              >
                Copy event link
              </ButtonNG>
              <ButtonNG
                className="ScheduleItemNG__button"
                onClick={goToEventLocation}
                variant="primary"
              >
                See on playa
              </ButtonNG>
            </div>
          </>
        )}
      </div>
      <div className="ScheduleItemNG__bookmark" onClick={bookmarkEvent}>
        <FontAwesomeIcon
          icon={event.isSaved ? solidBookmark : regularBookmark}
        />
      </div>
    </div>
  );
};
