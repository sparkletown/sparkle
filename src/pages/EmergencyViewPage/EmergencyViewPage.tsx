import React, { useEffect, useMemo, useState } from "react";
import classNames from "classnames";
import { addDays } from "date-fns";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

import { DEFAULT_VENUE_BANNER_COLOR } from "settings";

import {
  eventTimeAndOrderComparator,
  isEventWithinDateAndNotFinished,
} from "utils/event";
import { range } from "utils/range";
import { formatDateRelativeToNow } from "utils/time";

import { useWorldAndSpaceByParams } from "hooks/spaces/useWorldAndSpaceByParams";
import { useValidImage } from "hooks/useCheckImage";
import { useUser } from "hooks/useUser";
import useVenueScheduleEvents from "hooks/useVenueScheduleEvents";

import { WithNavigationBar } from "components/organisms/WithNavigationBar";

import { LoadingPage } from "components/molecules/LoadingPage";
import { ScheduleEventSubList } from "components/molecules/ScheduleEventList/ScheduleEventSubList";

import { NotFound } from "components/atoms/NotFound";

import { EmergencyViewPagePortals } from "./EmergencyViewPagePortals";
import EmergencyViewTabs from "./EmergencyViewTabs";

import "./EmergencyViewPage.scss";

dayjs.extend(advancedFormat);

const emptyPersonalizedSchedule = {};

export const EmergencyViewPage: React.FC = () => {
  const [selectedTab, updateTab] = useState(0);

  const {
    space,
    spaceId,
    isLoaded: isCurrentVenueLoaded,
  } = useWorldAndSpaceByParams();

  const { userWithId } = useUser();
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

  // TODO-redesign use it or delete it
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [validBannerImageUrl] = useValidImage(
    space?.config?.landingPageConfig.bannerImageUrl,
    DEFAULT_VENUE_BANNER_COLOR
  );

  const containerClasses = classNames("EmergencyView");

  if (!spaceId || (isCurrentVenueLoaded && !space)) {
    return (
      <WithNavigationBar withHiddenLoginButton>
        <NotFound />
      </WithNavigationBar>
    );
  }

  if (!space) {
    return <LoadingPage />;
  }

  return (
    <WithNavigationBar>
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
    </WithNavigationBar>
  );
};
