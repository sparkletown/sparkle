import React, { MouseEventHandler, useCallback, useState } from "react";
import { faBookmark as regularBookmark } from "@fortawesome/free-regular-svg-icons";
import {
  faBookmark as solidBookmark,
  faUserFriends as solidUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { differenceInCalendarDays } from "date-fns";

import {
  DEFAULT_VENUE_LOGO,
  PORTAL_INFO_ICON_MAPPING,
  SCHEDULE_SHOW_COPIED_TEXT_MS,
} from "settings";

import {
  addEventToPersonalizedSchedule,
  removeEventFromPersonalizedSchedule,
} from "api/profile";

import { ScheduledVenueEvent } from "types/venues";

import { eventEndTime, eventStartTime, isEventLive } from "utils/event";
import { getFirebaseStorageResizedImage } from "utils/image";
import { formatDateRelativeToNow, formatTimeLocalised } from "utils/time";
import { enterSpace, generateAttendeeInsideUrl } from "utils/url";

import { useRelatedVenues } from "hooks/useRelatedVenues";
import { useShowHide } from "hooks/useShowHide";
import { useUser } from "hooks/useUser";
import { useWorldParams } from "hooks/worlds/useWorldParams";

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
  const { currentVenue: eventVenue } = useRelatedVenues({
    currentVenueId: event.spaceId,
  });

  const { worldSlug } = useWorldParams();

  const { isShown: isEventExpanded, toggle: toggleEventExpand } = useShowHide();
  const showDate = Boolean(
    differenceInCalendarDays(eventEndTime({ event }), eventStartTime({ event }))
  );
  const isCurrentEventLive = isEventLive(event);

  const [isEventLinkCopied, setIsEventLinkCopied] = useState(false);
  const handleCopyEventLink = useCallback(
    (e?: React.MouseEvent<HTMLButtonElement>) => {
      // @debt get rid of stopPropagation() in the project allowing a valid event bubbling
      e && e.stopPropagation();

      // @debt Having empty world/space slugs is messy. I think we need to do
      // something higher up in the stack that guarantees we'll have at least a
      // world slug by the time we get to this point. Ideally, guarantees a
      // space slug too.
      const eventLink = generateAttendeeInsideUrl({
        worldSlug,
        spaceSlug: eventVenue?.slug,
        absoluteUrl: true,
      });
      navigator.clipboard.writeText(eventLink);
      setIsEventLinkCopied(true);
      setTimeout(
        () => setIsEventLinkCopied(false),
        SCHEDULE_SHOW_COPIED_TEXT_MS
      );
    },
    [worldSlug, eventVenue]
  );

  const goToEventLocation = useCallback(() => {
    enterSpace(worldSlug, eventVenue?.slug);
  }, [worldSlug, eventVenue]);

  const enterEventVenue = useCallback(
    () => enterSpace(worldSlug, eventVenue?.slug),
    [worldSlug, eventVenue]
  );

  const storedIcon =
    eventRoom?.image_url ?? event.venueIcon ?? eventVenue?.host?.icon;

  const defaultIcon =
    PORTAL_INFO_ICON_MAPPING[eventVenue?.template ?? ""] ?? DEFAULT_VENUE_LOGO;

  const eventImage = storedIcon
    ? getFirebaseStorageResizedImage(storedIcon, {
        fit: "crop",
        width: 40,
        height: 40,
      })
    : defaultIcon;

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

      // @debt get rid of stopPropagation() in the project allowing a valid event bubbling
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
            formatDateRelativeToNow(eventStartTime({ event }))}
        </span>

        <span className={timeContainer}>
          {isCurrentEventLive
            ? "Live"
            : formatTimeLocalised(eventStartTime({ event })) + "-"}
        </span>
        <span className="ScheduleItemNG__until ScheduleItemNG__time--end">
          {isCurrentEventLive && "until "}
        </span>

        <span className="ScheduleItemNG__date ScheduleItemNG__time--end">
          {showDate && formatDateRelativeToNow(eventEndTime({ event }))}
        </span>

        <span className="ScheduleItemNG__time ScheduleItemNG__time--end">
          {formatTimeLocalised(eventEndTime({ event }))}
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
          <span className="button--a" onClick={enterEventVenue}>
            {eventVenue?.name}
          </span>
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
                {isEventLinkCopied ? "Copied!" : "Copy event link"}
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
