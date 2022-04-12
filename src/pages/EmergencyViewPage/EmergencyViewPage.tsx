import React, { useEffect, useMemo, useState } from "react";
import { Redirect, useHistory } from "react-router-dom";
import classNames from "classnames";
import { NotFound } from "components/shared/NotFound";
import { addDays } from "date-fns";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

import { SIGN_IN_URL } from "settings";

import {
  eventTimeAndOrderComparator,
  isEventWithinDateAndNotFinished,
} from "utils/event";
import { range } from "utils/range";
import { formatDateRelativeToNow } from "utils/time";

import { useWorldAndSpaceByParams } from "hooks/spaces/useWorldAndSpaceByParams";
import { useUser } from "hooks/useUser";
import useVenueScheduleEvents from "hooks/useVenueScheduleEvents";

import { LoadingPage } from "components/molecules/LoadingPage";
import { ScheduleEventSubList } from "components/molecules/ScheduleEventList/ScheduleEventSubList";

import { EmergencyViewPagePortals } from "./EmergencyViewPagePortals";
import EmergencyViewTabs from "./EmergencyViewTabs";

import "./EmergencyViewPage.scss";

dayjs.extend(advancedFormat);

const emptyPersonalizedSchedule = {};

export const EmergencyViewPage: React.FC = () => {
  const history = useHistory();
  const [selectedTab, updateTab] = useState(0);

  const {
    space,
    spaceId,
    isLoaded: isCurrentVenueLoaded,
  } = useWorldAndSpaceByParams();

  const { user, userWithId } = useUser();
  const userEventIds =
    userWithId?.myPersonalizedSchedule ?? emptyPersonalizedSchedule;

  const {
    descendantVenues,
    dayDifference,
    liveAndFutureEvents,
    firstScheduleDate,
  } = useVenueScheduleEvents({
    userEventIds,
  });

  const redirectUrl = space?.config?.redirectUrl ?? "";
  const { hostname } = window.location;

  useEffect(() => {
    if (redirectUrl && redirectUrl !== hostname) {
      window.location.hostname = redirectUrl;
    }
  }, [hostname, redirectUrl]);

  const weekdays = useMemo(() => {
    return range(dayDifference)
      .map((dayIndex) => {
        const day = addDays(firstScheduleDate, dayIndex);

        const dailyEvents = liveAndFutureEvents.filter(
          isEventWithinDateAndNotFinished(day)
        );

        const eventsFilledWithPriority = dailyEvents.sort(
          eventTimeAndOrderComparator
        );

        if (!dailyEvents.length) {
          return null;
        }
        return (
          <div className="EmergencyView__weekdays-column" key={day.getTime()}>
            <ScheduleEventSubList
              events={eventsFilledWithPriority}
              title={`Events on ${formatDateRelativeToNow(day)}`}
              isShowFullInfo={false}
            />
          </div>
        );
      })
      .filter((day) => !!day);
  }, [dayDifference, liveAndFutureEvents, firstScheduleDate]);

  const containerClasses = classNames("EmergencyView");

  if (!spaceId || (isCurrentVenueLoaded && !space)) {
    return <NotFound />;
  }

  if (!space) {
    return <LoadingPage />;
  }

  if (!user) {
    return (
      <Redirect
        to={{
          pathname: SIGN_IN_URL,
          search: `?returnUrl=${history.location.pathname}`,
        }}
      />
    );
  }

  return (
    <div className={containerClasses}>
      <EmergencyViewTabs updateTab={updateTab} selectedTab={selectedTab} />
      <div className="EmergencyView__main">
        {!selectedTab ? (
          <EmergencyViewPagePortals descendantVenues={descendantVenues} />
        ) : (
          <ul className="EmergencyView__weekdays">{weekdays}</ul>
        )}
      </div>
    </div>
  );
};
