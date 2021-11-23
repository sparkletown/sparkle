import React from "react";
import ShowMoreText from "react-show-more-text";

import { VenueEvent } from "types/venues";

import { eventEndTime, eventStartTime, isEventLive } from "utils/event";
import {
  formatDate,
  formatDateRelativeToNow,
  formatTimeLocalised,
} from "utils/time";

import { RenderMarkdown } from "components/organisms/RenderMarkdown";

import "./PortalScheduleItem.scss";

interface PropsType {
  event: VenueEvent;
  expandableDescription?: boolean;
  defaultDescriptionLineNumber?: number;
}

export const ScheduleItem: React.FunctionComponent<PropsType> = ({
  event,
  expandableDescription = false,
  defaultDescriptionLineNumber = 3,
}) => {
  const isCurrentEventLive = isEventLive(event);
  return (
    <div className="ScheduleItem">
      <div className="ScheduleItem__event-dates">
        <span className="ScheduleItem__event-date">
          {formatDateRelativeToNow(eventStartTime(event), {
            formatToday: () => "",
            formatTomorrow: formatDate,
          })}
        </span>

        <span className="ScheduleItem__event-time">
          {formatTimeLocalised(eventStartTime(event))}
        </span>

        <span className="ScheduleItem__event-end-time">
          {formatTimeLocalised(eventEndTime(event))}
        </span>

        {isCurrentEventLive && (
          <div className="ScheduleItem__event-live-label">Live</div>
        )}
      </div>

      <div className="ScheduleItem__event-info">
        <div className="ScheduleItem__event-name">{event.name}</div>
        <div>
          <span className="ScheduleItem__event-host-prefix">by </span>
          <span className="ScheduleItem__event-host">{event.host}</span>
        </div>
        {expandableDescription ? (
          <ShowMoreText
            lines={defaultDescriptionLineNumber}
            more="Show more"
            less="Show less"
            className="ScheduleItem__event-description"
            expanded={false}
            truncatedEndingComponent={"... "}
          >
            {event.description}
          </ShowMoreText>
        ) : (
          <div className="ScheduleItem__event-description">
            <RenderMarkdown text={event.description} />
          </div>
        )}
      </div>
    </div>
  );
};
