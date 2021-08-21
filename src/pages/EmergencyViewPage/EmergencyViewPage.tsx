import React, { useEffect, useMemo, useState } from "react";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { addDays } from "date-fns";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

import {
  DEFAULT_VENUE_BANNER,
  DEFAULT_VENUE_LOGO,
  IFRAME_ALLOW,
} from "settings";

import {
  eventTimeAndOrderComparator,
  isEventLive,
  isEventWithinDateAndNotFinished,
} from "utils/event";
import { range } from "utils/range";
import { currentVenueSelectorData } from "utils/selectors";
import { formatDateRelativeToNow } from "utils/time";

import useConnectCurrentVenue from "hooks/useConnectCurrentVenue";
import { useSelector } from "hooks/useSelector";
import { useUser } from "hooks/useUser";
import { useVenueId } from "hooks/useVenueId";
import useVenueScheduleEvents from "hooks/useVenueScheduleEvents";

import { updateTheme } from "pages/VenuePage/helpers";

import WithNavigationBar from "components/organisms/WithNavigationBar";

import { LoadingPage } from "components/molecules/LoadingPage";
import { ScheduleEventSubListNG } from "components/molecules/ScheduleEventListNG/ScheduleEventSubListNG";

import EmergencyViewRoom from "./EmergencyViewRoom";

import "./EmergencyViewPage.scss";

export const emptyPersonalizedSchedule = {};

const tabs = [
  { id: 0, title: "Spaces" },
  { id: 1, title: `What's on` },
];

export const EmergencyViewPage: React.FC = () => {
  const [selectedTab, updateTab] = useState(0);
  const venueId = useVenueId() || "";
  useConnectCurrentVenue();

  const venue = useSelector(currentVenueSelectorData);
  const { userWithId } = useUser();
  const userEventIds =
    userWithId?.myPersonalizedSchedule ?? emptyPersonalizedSchedule;

  const {
    descendantVenues,
    dayDifference,
    liveAndFutureEvents,
    firstScheduleDate,
  } = useVenueScheduleEvents({
    venueId,
    userEventIds,
  });

  const venueRequestStatus = useSelector(
    (state) => state.firestore.status.requested.currentVenue
  );
  const redirectUrl = venue?.config?.redirectUrl ?? "";
  const { hostname } = window.location;

  useEffect(() => {
    if (redirectUrl && redirectUrl !== hostname) {
      window.location.hostname = redirectUrl;
    }
  }, [hostname, redirectUrl]);

  dayjs.extend(advancedFormat);

  useEffect(() => {
    if (!venue) return;

    // @debt replace this with useCss?
    updateTheme(venue);
  }, [venue]);

  const weekdays = useMemo(() => {
    return range(dayDifference)
      .map((dayIndex) => {
        const day = addDays(firstScheduleDate, dayIndex);

        const dailyEvents = liveAndFutureEvents.filter(
          isEventWithinDateAndNotFinished(day)
        );

        const eventsFilledWithPriority = dailyEvents
          .map((event) => ({
            ...event,
            orderPriority: event.orderPriority ?? 0,
          }))
          .sort(eventTimeAndOrderComparator);

        if (!dailyEvents.length) {
          return null;
        }

        return (
          <div
            className="EmergencyView__weekdays__column"
            key={day.toISOString()}
          >
            <ScheduleEventSubListNG
              events={eventsFilledWithPriority}
              title={`Events on ${formatDateRelativeToNow(day)}`}
              isShowBookmark={false}
              isShowImage={false}
              isShowDayDate={false}
            />
          </div>
        );
      })
      .filter((day) => !!day);
  }, [dayDifference, liveAndFutureEvents, firstScheduleDate]);

  if (venueRequestStatus && !venue) {
    return <>This venue does not exist</>;
  }

  if (!venue) {
    return <LoadingPage />;
  }

  const liveEvents = liveAndFutureEvents.filter(isEventLive);
  const isRoomHasLiveEvent = (room: string) =>
    liveEvents.map((event) => event.room).includes(room);

  return (
    <WithNavigationBar>
      <div className="container venue-entrance-experience-container">
        <div
          className="header"
          style={{
            background: `linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.8) 2%,
            rgba(0, 0, 0, 0) 98%
          ), url(${
            venue.config?.landingPageConfig.bannerImageUrl ??
            DEFAULT_VENUE_BANNER
          }`,
            backgroundSize: "cover",
          }}
        >
          <div className="venue-host">
            <div className="host-icon-container">
              <img
                className="host-icon"
                src={!venue.host?.icon ? DEFAULT_VENUE_LOGO : venue.host?.icon}
                alt="host"
              />
            </div>

            <div className="title">{venue.name}</div>

            <div className="subtitle">
              {venue.config?.landingPageConfig.subtitle}
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-6 col-12 venue-presentation">
            <div>
              <div
                style={{ whiteSpace: "pre-wrap", overflowWrap: "break-word" }}
              >
                {venue.config?.landingPageConfig.description}
              </div>

              <div>
                {venue.config?.landingPageConfig?.checkList?.map(
                  (checkListItem: string, index: number) => (
                    <div
                      key={`checklist-item-${index}`}
                      className="checklist-item"
                    >
                      <div className="check-icon-container">
                        <FontAwesomeIcon icon={faCheckCircle} />
                      </div>
                      <div>{checkListItem}</div>
                    </div>
                  )
                )}
              </div>
            </div>

            {venue.config?.landingPageConfig.iframeUrl && (
              <iframe
                title="entrance video"
                width="100%"
                height="300"
                className="youtube-video"
                src={venue.config?.landingPageConfig.iframeUrl}
                frameBorder="0"
                allow={IFRAME_ALLOW}
              />
            )}

            {venue.config?.landingPageConfig?.quotations?.map(
              (quotation, index) => (
                <div
                  className="quotation-container"
                  key={`${quotation.text}-${index}`}
                >
                  <div className="quotation">{quotation.text}</div>
                  <div className="quotation-author">- {quotation.author}</div>
                </div>
              )
            )}

            {venue.config?.landingPageConfig?.presentation?.map(
              (paragraph: string, index: number) => (
                <p
                  key={`venue-presentation-paragraph-${index}`}
                  className="presentation-paragraph"
                >
                  {paragraph}
                </p>
              )
            )}
          </div>
        </div>
      </div>
      <div className="EmergencyView">
        <div className="EmergencyView_tabs">
          {tabs.map((tab) => (
            <div
              className={`EmergencyView_tabs_item${
                tab.id === selectedTab ? "--active" : ""
              }`}
              key={tab.id}
              onClick={() => updateTab(tab.id)}
            >
              {tab.title}
            </div>
          ))}
        </div>
        <div className="EmergencyView_main">
          {!selectedTab ? (
            descendantVenues.map((venue) => (
              <>
                {!!venue?.rooms?.length && (
                  <>
                    <span className="EmergencyView_venue">{venue.id}</span>
                    <div key={venue.id} className="EmergencyView_content">
                      {venue?.rooms?.map((room) => {
                        const isRoomLive = isRoomHasLiveEvent(room.title);

                        return (
                          <EmergencyViewRoom
                            key={room.title}
                            room={room}
                            venueName={venue.name}
                            isLive={isRoomLive}
                          />
                        );
                      })}
                    </div>
                  </>
                )}
              </>
            ))
          ) : (
            <ul className="EmergencyView__weekdays">{weekdays}</ul>
          )}
        </div>
      </div>
    </WithNavigationBar>
  );
};
