import React from "react";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { format } from "date-fns";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

import {
  ATTENDEE_STEPPING_PARAM_URL,
  DEFAULT_ENTER_STEP,
  DEFAULT_LANDING_BANNER,
  DEFAULT_VENUE_LOGO,
  IFRAME_ALLOW,
} from "settings";

import {
  SpaceWithId,
  UserId,
  WorldAndSpaceIdLocation,
  WorldAndSpaceSlugLocation,
  WorldWithId,
} from "types/id";
import { VenueAccessMode } from "types/VenueAcccess";

import { eventEndTime, eventStartTime, hasEventFinished } from "utils/event";
import { formatTimeLocalised, getTimeBeforeParty } from "utils/time";
import { generateAttendeeInsideUrl, generateUrl } from "utils/url";

import { useWorldEvents } from "hooks/events";
import { useValidImage } from "hooks/useCheckImage";

import { InformationCard } from "components/molecules/InformationCard";
import { SecretPasswordForm } from "components/molecules/SecretPasswordForm";
import { RenderMarkdown } from "components/organisms/RenderMarkdown";

dayjs.extend(advancedFormat);

type VenueLandingPageContentProps = WorldAndSpaceIdLocation &
  WorldAndSpaceSlugLocation & {
    userId: UserId;
    space: SpaceWithId;
    world: WorldWithId;
  };

export const VenueLandingPageContent: React.FC<VenueLandingPageContentProps> = ({
  userId,
  space,
  spaceSlug,
  world,
  worldId,
  worldSlug,
}) => {
  const landingPageConfig = space.config?.landingPageConfig;
  const logoUrl = space?.host?.icon;
  const coverUrl = landingPageConfig?.coverImageUrl;

  // TODO-redesign use it or delete it
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [validLogoUrl] = useValidImage(logoUrl, DEFAULT_VENUE_LOGO);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [validBannerUrl] = useValidImage(coverUrl, DEFAULT_LANDING_BANNER);

  const { events } = useWorldEvents({ worldId });

  const futureOrOngoingEvents = events?.filter(
    (event) => !hasEventFinished(event)
  );
  futureOrOngoingEvents?.sort(
    (eventA, eventB) => eventA.startUtcSeconds - eventB.startUtcSeconds
  );
  const nextVenueEventId = futureOrOngoingEvents?.[0]?.id;

  // @debt use callback hook and history push
  const onJoinClick = () => {
    if (!spaceSlug) return;

    const hasEntrance = world?.entrance?.length;

    window.location.href =
      userId && !hasEntrance
        ? generateAttendeeInsideUrl({ worldSlug, spaceSlug })
        : generateUrl({
            route: ATTENDEE_STEPPING_PARAM_URL,
            required: ["worldSlug", "spaceSlug", "step"],
            params: { worldSlug, spaceSlug, step: DEFAULT_ENTER_STEP },
          });
  };

  const isPasswordRequired = space.access === VenueAccessMode.Password;

  const containerClasses = classNames("header");

  return (
    <div className="VenueLandingPageContent container venue-entrance-experience-container">
      <div className={containerClasses}>
        <div className="venue-host">
          <div className="host-icon-container">
            <img className="host-icon" src={validLogoUrl} alt="host" />
          </div>

          <div className="title">{space.name}</div>

          <div className="subtitle">{landingPageConfig?.subtitle}</div>
        </div>

        {isPasswordRequired && (
          <div className="secret-password-form-wrapper">
            <SecretPasswordForm
              buttonText={landingPageConfig?.joinButtonText}
            />
          </div>
        )}

        {!isPasswordRequired && (
          // @debt: this is commented out because we want the button to show even if there are future and ongoing events, but we are not sure why this logic is in place
          // (!futureOrOngoingVenueEvents ||
          //   futureOrOngoingVenueEvents.length === 0) &&
          <button
            className="btn btn-primary btn-block btn-centered"
            onClick={onJoinClick}
          >
            Join the event
            {(space?.start_utc_seconds ?? 0) > new Date().getTime() / 1000 && (
              <span className="countdown">
                Begins in {getTimeBeforeParty(space.start_utc_seconds)}
              </span>
            )}
          </button>
        )}
      </div>

      <div className="row">
        <div className="col-lg-6 col-12 venue-presentation">
          <div>
            <div>{space.config?.landingPageConfig.description}</div>

            <div>
              {landingPageConfig?.checkList?.map(
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

          {landingPageConfig?.iframeUrl && (
            <iframe
              title="entrance video"
              width="100%"
              height="300"
              className="youtube-video"
              src={space.config?.landingPageConfig.iframeUrl}
              frameBorder="0"
              allow={IFRAME_ALLOW}
            />
          )}

          {landingPageConfig?.quotations?.map((quotation, index) => (
            <div className="quotation-container" key={index}>
              <div className="quotation">{quotation.text}</div>
              <div className="quotation-author">- {quotation.author}</div>
            </div>
          ))}

          {landingPageConfig?.presentation?.map(
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

        <div className="col-lg-6 col-12 oncoming-events">
          {futureOrOngoingEvents && futureOrOngoingEvents.length > 0 && (
            <>
              <div className="upcoming-gigs-title">Upcoming events</div>
              {futureOrOngoingEvents.slice(0, 10).map((venueEvent) => {
                const startTime = formatTimeLocalised(
                  eventStartTime({ event: venueEvent })
                );
                const endTime = formatTimeLocalised(
                  eventEndTime({ event: venueEvent })
                );
                const startDay = format(
                  eventStartTime({ event: venueEvent }),
                  "EEEE LLLL do"
                );

                const isNextVenueEvent = venueEvent.id === nextVenueEventId;
                return (
                  <InformationCard
                    title={venueEvent.name}
                    key={venueEvent.id}
                    containerClassName={`${
                      !isNextVenueEvent ? "disabled" : ""
                    }`}
                  >
                    <div className="date">
                      {`${startTime}-${endTime} ${startDay}`}
                    </div>
                    <div className="event-description">
                      <RenderMarkdown text={venueEvent.description} />
                    </div>
                  </InformationCard>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
