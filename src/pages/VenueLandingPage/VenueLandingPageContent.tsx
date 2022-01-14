import React from "react";
import { useHistory } from "react-router-dom";
import { useCss } from "react-use";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { format } from "date-fns";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

import {
  ATTENDEE_SPACE_ENTRANCE_URL,
  ATTENDEE_SPACE_INSIDE_URL,
  DEFAULT_LANDING_BANNER,
  DEFAULT_VENUE_LOGO,
  IFRAME_ALLOW,
} from "settings";

import { World } from "api/world";

import { VenueAccessMode } from "types/VenueAcccess";
import { AnyVenue } from "types/venues";

import { eventEndTime, eventStartTime, hasEventFinished } from "utils/event";
import { WithId } from "utils/id";
import { venueEventsSelector } from "utils/selectors";
import { formatTimeLocalised, getTimeBeforeParty } from "utils/time";
import { generateUrl } from "utils/url";

import { useValidImage } from "hooks/useCheckImage";
import { useSelector } from "hooks/useSelector";
import { useUser } from "hooks/useUser";

import { RenderMarkdown } from "components/organisms/RenderMarkdown";

import InformationCard from "components/molecules/InformationCard";
import SecretPasswordForm from "components/molecules/SecretPasswordForm";

dayjs.extend(advancedFormat);

type VenueLandingPageContentProps = {
  space: WithId<AnyVenue>;
  world: WithId<World>;
  withJoinEvent?: boolean;
};
const VenueLandingPageContent: React.FC<VenueLandingPageContentProps> = ({
  space,
  world,
  withJoinEvent = true,
}) => {
  const history = useHistory();
  const venueEvents = useSelector(venueEventsSelector);

  const spaceSlug = space.slug;

  const [validBannerImageUrl] = useValidImage(
    space?.config?.landingPageConfig.coverImageUrl,
    DEFAULT_LANDING_BANNER
  );

  const [validLogoUrl] = useValidImage(space?.host?.icon, DEFAULT_VENUE_LOGO);
  const futureOrOngoingVenueEvents = venueEvents?.filter(
    (event) => !hasEventFinished(event)
  );
  const nextVenueEventId = futureOrOngoingVenueEvents?.[0]?.id;

  const onJoinClick = () => {
    if (!spaceSlug) return;

    const hasEntrance = world?.entrance?.length;
    const worldSlug = world.slug;

    const redirectUrl = generateUrl({
      route:
        user && !hasEntrance
          ? ATTENDEE_SPACE_INSIDE_URL
          : ATTENDEE_SPACE_ENTRANCE_URL,
      required: ["worldSlug", "spaceSlug"],
      params: { worldSlug, spaceSlug, step: "1" },
    });

    history.push(redirectUrl);
  };

  const isPasswordRequired = space.access === VenueAccessMode.Password;

  const { user } = useUser();

  const containerVars = useCss({
    background: `linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.8) 2%,
            rgba(0, 0, 0, 0) 98%
          ), url("${validBannerImageUrl}")`,
    backgroundSize: "cover",
  });

  const containerClasses = classNames("header", containerVars);

  return (
    <div className="container venue-entrance-experience-container">
      <div className={containerClasses}>
        <div className="venue-host">
          <div className="host-icon-container">
            <img className="host-icon" src={validLogoUrl} alt="host" />
          </div>

          <div className="title">{space.name}</div>

          <div className="subtitle">
            {space.config?.landingPageConfig.subtitle}
          </div>
        </div>

        {isPasswordRequired && (
          <div className="secret-password-form-wrapper">
            <SecretPasswordForm
              buttonText={space.config?.landingPageConfig.joinButtonText}
            />
          </div>
        )}

        {!isPasswordRequired && withJoinEvent && (
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
            <div style={{ whiteSpace: "pre-wrap", overflowWrap: "break-word" }}>
              {space.config?.landingPageConfig.description}
            </div>

            <div>
              {space.config?.landingPageConfig?.checkList?.map(
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

          {space.config?.landingPageConfig?.iframeUrl && (
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

          {space.config?.landingPageConfig?.quotations?.map(
            (quotation, index) => (
              <div className="quotation-container" key={index}>
                <div className="quotation">{quotation.text}</div>
                <div className="quotation-author">- {quotation.author}</div>
              </div>
            )
          )}

          {space.config?.landingPageConfig?.presentation?.map(
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
          {futureOrOngoingVenueEvents && futureOrOngoingVenueEvents.length > 0 && (
            <>
              <div className="upcoming-gigs-title">Upcoming events</div>
              {futureOrOngoingVenueEvents.map((venueEvent) => {
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
                      {venueEvent.descriptions?.map((description, index) => (
                        <RenderMarkdown
                          text={description}
                          key={`${description}#${index}`}
                        />
                      ))}
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

export default VenueLandingPageContent;
