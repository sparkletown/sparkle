import ShowMoreText from "react-show-more-text";
import cn from "classnames";

import { STRING_DASH_SPACE, STRING_SPACE } from "settings";

import { WorldEvent } from "types/venues";

import { eventEndTime, eventStartTime } from "utils/event";
import { formatTimeLocalised } from "utils/time";

import { RenderMarkdown } from "components/organisms/RenderMarkdown";

import CN from "./EventInfo.module.scss";

interface EventInfoProps {
  event: WorldEvent;
  centered?: boolean;
}

const moreLessSpan = (text: string) => (
  <span className={CN.moreLessSpan}>{text}</span>
);

export const EventInfo: React.FC<EventInfoProps> = ({ event, centered }) => (
  <div data-bem="EventInfo" className={cn(CN.general, centered && CN.centered)}>
    <h3 className={CN.paragraph}>{event.name}</h3>

    {event.host && <div className={CN.paragraph}>By {event.host}</div>}

    <div className={CN.paragraph}>
      <span>
        {formatTimeLocalised(eventStartTime({ event })) + STRING_DASH_SPACE}
      </span>
      {STRING_SPACE}
      <span>{STRING_SPACE + formatTimeLocalised(eventEndTime({ event }))}</span>
    </div>

    <div className={CN.paragraph}>
      <ShowMoreText
        lines={5}
        anchorClass={CN.showMoreLessAnchor}
        more={moreLessSpan("More")}
        less={moreLessSpan("Less")}
        expanded={false}
      >
        <RenderMarkdown text={event.description} />
      </ShowMoreText>
    </div>
  </div>
);
