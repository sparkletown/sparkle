import React, { MouseEventHandler, useCallback, useMemo } from "react";
import { faBookmark as regularBookmark } from "@fortawesome/free-regular-svg-icons";
import {
  faBookmark as solidBookmark,
  faUserFriends as solidUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { differenceInCalendarDays } from "date-fns";

import {
  addEventToPersonalizedSchedule,
  removeEventFromPersonalizedSchedule,
} from "api/profile";

import { Room } from "types/rooms";
import { ScheduledVenueEvent } from "types/venues";

import { eventEndTime, eventStartTime, isEventLive } from "utils/event";
import { getFirebaseStorageResizedImage } from "utils/image";
import { formatDateRelativeToNow, formatTimeLocalised } from "utils/time";
import {
  enterVenue,
  getFullVenueInsideUrl,
  getLastUrlParam,
  getUrlParamFromString,
  getUrlWithoutTrailingSlash,
  openUrl,
} from "utils/url";

import { useRelatedVenues } from "hooks/useRelatedVenues";
import { useRoom } from "hooks/useRoom";
import { useShowHide } from "hooks/useShowHide";
import { useUser } from "hooks/useUser";

import { RenderMarkdown } from "components/organisms/RenderMarkdown";

import { ButtonNG } from "components/atoms/ButtonNG";

import "./ScheduleItemNG.scss";

export interface ScheduleItemNGProps {
  event: ScheduledVenueEvent;
  isShowFullInfo: boolean;
}

export const ScheduleItemNG: React.FC<ScheduleItemNGProps> = ({
  event,
  isShowFullInfo,
}) => {
  const { currentVenue: eventVenue, relatedVenues } = useRelatedVenues({
    currentVenueId: event.venueId,
  });

  const relatedVenuesRooms = relatedVenues
    ?.flatMap((venue) => venue.rooms ?? [])
    .filter((room) => room !== undefined);

  const eventRoom = useMemo<Room | undefined>(
    () =>
      relatedVenuesRooms?.find((room) => {
        const { room: eventRoom = "" } = event;
        const noTrailSlashUrl = getUrlWithoutTrailingSlash(room.url);

        const [roomName] = getLastUrlParam(noTrailSlashUrl);
        const roomUrlParam = getUrlParamFromString(eventRoom);
        const selectedRoom = getUrlParamFromString(room.title) === roomUrlParam;

        return roomUrlParam.endsWith(`${roomName}`) || selectedRoom;
      }),
    [relatedVenuesRooms, event]
  );
  const { isShown: isEventExpanded, toggle: toggleEventExpand } = useShowHide();
  const { enterRoom } = useRoom({
    room: eventRoom,
    venueName: eventVenue?.name ?? "",
  });
  const showDate = Boolean(
    differenceInCalendarDays(eventEndTime(event), eventStartTime(event))
  );
  const isCurrentEventLive = isEventLive(event);
  const roomUrlParam = getUrlParamFromString(event.room ?? "");

  const handleCopyEventLink = useCallback(
    (e?: React.MouseEvent<HTMLButtonElement>) => {
      e && e.stopPropagation();

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

  const eventImage = getFirebaseStorageResizedImage(
    eventRoom?.image_url ?? event.venueIcon,
    {
      fit: "crop",
      width: 40,
      height: 40,
    }
  );

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
            isShowFullInfo &&
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

      {isShowFullInfo && (
        <img
          className="ScheduleItemNG__icon"
          src={eventImage}
          alt="event location"
        />
      )}

      <div className="ScheduleItemNG__details">
        <div className="ScheduleItemNG__name">{event.name}</div>
        <div className="ScheduleItemNG__place">
          <span className="ScheduleItemNG__place--location">in</span>{" "}
          {event.room || eventVenue?.name}
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
                {/* See on Playa is needed only for `env/burn` */}
                Visit event
              </ButtonNG>
            </div>
          </>
        )}
      </div>
      {isCurrentEventLive && (
        <div className="ScheduleItemNG__online">
          <FontAwesomeIcon
            className="ScheduleItemNG__online-icon"
            icon={solidUsers}
          />
          <span>{event.liveAudience}</span>
        </div>
      )}
      {isShowFullInfo && (
        <div className="ScheduleItemNG__bookmark" onClick={bookmarkEvent}>
          <FontAwesomeIcon
            icon={event.isSaved ? solidBookmark : regularBookmark}
          />
        </div>
      )}
    </div>
  );
};
