import React from "react";
import ShowMoreText from "react-show-more-text";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { WorldExperience } from "types/venues";

import { eventEndTime, eventStartTime, isEventLive } from "utils/event";
import {
  formatDate,
  formatDateRelativeToNow,
  formatTimeLocalised,
} from "utils/time";

import { RenderMarkdown } from "components/organisms/RenderMarkdown";

import "./PortalScheduleItem.scss";

interface PortalScheduleItemProps {
  event: WorldExperience;
  expandableDescription?: boolean;
  defaultDescriptionLineNumber?: number;
  isSaved?: boolean;
}

export const PortalScheduleItem: React.FunctionComponent<PortalScheduleItemProps> = ({
  event,
  expandableDescription = false,
  defaultDescriptionLineNumber = 3,
  isSaved = false,
}) => {
  const isCurrentEventLive = isEventLive(event);
  return (
    <div className="PortalScheduleItem">
      <div className="PortalScheduleItem__event-dates">
        <span className="PortalScheduleItem__event-date">
          {formatDateRelativeToNow(eventStartTime({ event }), {
            formatToday: () => "",
            formatTomorrow: formatDate,
          })}
        </span>

        <span className="PortalScheduleItem__event-time">
          {formatTimeLocalised(eventStartTime({ event }))}
        </span>

        <span className="PortalScheduleItem__event-end-time">
          {formatTimeLocalised(eventEndTime({ event }))}
        </span>

        {isCurrentEventLive && (
          <div className="PortalScheduleItem__event-live-label">Live</div>
        )}
      </div>

      <div className="PortalScheduleItem__event-info">
        <div className="PortalScheduleItem__event-name">{event.name}</div>
        <div>
          <span className="PortalScheduleItem__event-host-prefix">by </span>
          <span className="PortalScheduleItem__event-host">{event.host}</span>
        </div>
        {expandableDescription ? (
          <ShowMoreText
            lines={defaultDescriptionLineNumber}
            more="Show more"
            less="Show less"
            className="PortalScheduleItem__event-description"
            expanded={false}
            truncatedEndingComponent={"... "}
          >
            {event.description}
          </ShowMoreText>
        ) : (
          <div className="PortalScheduleItem__event-description">
            <RenderMarkdown text={event.description} />
          </div>
        )}

        {isSaved && (
          <div className="PortalScheduleItem__bookmark" title="bookmarked">
            <FontAwesomeIcon icon={faBookmark} />
          </div>
        )}
      </div>
    </div>
  );
};
