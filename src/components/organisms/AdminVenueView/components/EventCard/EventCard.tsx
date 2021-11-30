import React from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import { sortBy } from "lodash";

import { VenueEvent } from "types/venues";

import { isEventLive } from "utils/event";
import { WithId, WithVenueId } from "utils/id";
import { formatTimeLocalised } from "utils/time";
import { adminNGVenueUrl } from "utils/url";

import { useSpaceParams } from "hooks/spaces/useSpaceParams";

import { AdminVenueTab } from "components/organisms/AdminVenueView/AdminVenueView";

import "./EventCard.scss";

interface EventCardProps {
  events?: WithVenueId<WithId<VenueEvent>>[];
}

export const EventCard: React.FC<EventCardProps> = ({ events }) => {
  const { spaceSlug, worldSlug } = useSpaceParams();
  const [nextEvent, followingEvent] = sortBy(events ?? [], "start_utc_seconds");
  const live = nextEvent && isEventLive(nextEvent);

  const parentClasses = classNames("EventCard", {
    "EventCard--no-event": !nextEvent,
    "EventCard--live-event": nextEvent && live,
    "EventCard--future-event": nextEvent && !live,
  });

  const linkClasses = classNames("EventCard__add", {
    "EventCard__add--no-event": !nextEvent,
    "EventCard__add--future-event": nextEvent,
  });

  return (
    <div className={parentClasses}>
      {!nextEvent && (
        <span className="EventCard__empty">No upcoming events</span>
      )}

      {nextEvent && (
        <span className="EventCard__corner">
          {live ? "Current event" : "Next event"}
        </span>
      )}

      <Link
        className={linkClasses}
        to={adminNGVenueUrl(worldSlug, spaceSlug, AdminVenueTab.timing)}
      >
        Add event
      </Link>

      {nextEvent && (
        <>
          <div className="EventCard__time--first">
            {formatTimeLocalised(nextEvent.start_utc_seconds)}
          </div>
          <div className="EventCard__name--first">{nextEvent.name}</div>
        </>
      )}

      {followingEvent && (
        <>
          <div className="EventCard__time--subsequent">
            {formatTimeLocalised(followingEvent.start_utc_seconds)}
          </div>
          <div className="EventCard__name--subsequent">
            {followingEvent.name}
          </div>
        </>
      )}
    </div>
  );
};
