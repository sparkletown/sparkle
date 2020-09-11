import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CountDown from "components/molecules/CountDown";
import EventPaymentButton from "components/molecules/EventPaymentButton";
import InformationCard from "components/molecules/InformationCard";
import SecretPasswordForm from "components/molecules/SecretPasswordForm";
import AuthenticationModal from "components/organisms/AuthenticationModal";
import PaymentModal from "components/organisms/PaymentModal";
import WithNavigationBar from "components/organisms/WithNavigationBar";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import useConnectCurrentVenue from "hooks/useConnectCurrentVenue";
import { useSelector } from "hooks/useSelector";
import { useUser } from "hooks/useUser";
import { updateTheme } from "pages/VenuePage/helpers";
import React, { useEffect, useState } from "react";
import { useFirestoreConnect } from "react-redux-firebase";
import { Link, useParams } from "react-router-dom";
import { Firestore } from "types/Firestore";
import { VenueEvent } from "types/VenueEvent";
import { VenueTemplate } from "types/VenueTemplate";
import { hasUserBoughtTicketForEvent } from "utils/hasUserBoughtTicket";
import { WithId } from "utils/id";
import { isUserAMember } from "utils/isUserAMember";
import { ONE_MINUTE_IN_SECONDS } from "utils/time";
import "./VenueLandingPage.scss";
import { venueInsideUrl } from "utils/url";

export interface VenueLandingPageProps {
  venue: Firestore["data"]["currentVenue"];
  venueEvents?: Firestore["ordered"]["venueEvents"];
  venueRequestStatus: Firestore["status"]["requested"]["currentVenue"];
  purchaseHistory?: Firestore["ordered"]["userPurchaseHistory"];
  venueId?: string;
}

export const VenueLandingPage: React.FunctionComponent<VenueLandingPageProps> = () => {
  const { venueId } = useParams();
  useConnectCurrentVenue();

  const {
    venue,
    venueEvents,
    venueRequestStatus,
    purchaseHistory,
  } = useSelector((state) => ({
    venue: state.firestore.data.currentVenue,
    venueRequestStatus: state.firestore.status.requested.currentVenue,
    venueEvents: state.firestore.ordered.venueEvents,
    purchaseHistory: state.firestore.ordered.userPurchaseHistory,
  }));

  useFirestoreConnect({
    collection: "venues",
    doc: venueId,
    subcollections: [{ collection: "events" }],
    storeAs: "venueEvents",
    orderBy: ["start_utc_seconds", "asc"],
  });

  dayjs.extend(advancedFormat);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<
    WithId<VenueEvent> | undefined
  >();
  const [isAuthenticationModalOpen, setIsAuthenticationModalOpen] = useState(
    false
  );
  const [shouldOpenPaymentModal, setShouldOpenPaymentModal] = useState(false);
  const [eventPaidSuccessfully, setEventPaidSuccessfully] = useState<
    string | undefined
  >();

  const { user } = useUser();

  const futureOrOngoingVenueEvents = venueEvents?.filter(
    (event) =>
      event.start_utc_seconds + event.duration_minutes * ONE_MINUTE_IN_SECONDS >
      Date.now() / 1000
  );

  venue && updateTheme(venue);

  useEffect(() => {
    if (shouldOpenPaymentModal && !isAuthenticationModalOpen) {
      setIsPaymentModalOpen(true);
      setShouldOpenPaymentModal(false);
    }
  }, [shouldOpenPaymentModal, isAuthenticationModalOpen]);

  if (venueRequestStatus && !venue) {
    return <>This venue does not exist</>;
  }

  if (!venue) {
    return <>Loading...</>;
  }

  const isUserVenueOwner = user && venue.owners?.includes(user.uid);

  const nextVenueEventId = futureOrOngoingVenueEvents?.[0]?.id;

  const closePaymentModal = () => {
    setIsPaymentModalOpen(false);
  };

  const openAuthenticationModal = () => {
    setIsAuthenticationModalOpen(true);
  };

  const closeAuthenticationModal = () => {
    setIsAuthenticationModalOpen(false);
  };

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
            venue.config?.landingPageConfig.coverImageUrl
          }`,
            backgroundSize: "cover",
          }}
        >
          <div className="venue-host">
            <div className="host-icon-container">
              <img className="host-icon" src={venue.host.icon} alt="host" />
            </div>
            <div className="title">{venue.name}</div>
            <div className="subtitle">
              {venue.config?.landingPageConfig.subtitle}
            </div>
          </div>
          {venue.template === VenueTemplate.partymap && (
            <div className="secret-password-form-wrapper">
              <SecretPasswordForm
                buttonText={venue.config?.landingPageConfig.joinButtonText}
              />
            </div>
          )}
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
                {venue.config?.landingPageConfig.checkList &&
                  venue.config?.landingPageConfig.checkList.map(
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
            {venue.config?.landingPageConfig.videoIframeUrl && (
              <iframe
                title="entrance video"
                width="100%"
                height="300"
                className="youtube-video"
                src={venue.config?.landingPageConfig.videoIframeUrl}
                frameBorder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture;"
              />
            )}
            {venue.config?.landingPageConfig.quotations &&
              venue.config?.landingPageConfig.quotations.map(
                (quotation, index) => (
                  <div className="quotation-container" key={index}>
                    <div className="quotation">{quotation.text}</div>
                    <div className="quotation-author">- {quotation.author}</div>
                  </div>
                )
              )}
            {venue.config?.landingPageConfig.presentation &&
              venue.config?.landingPageConfig.presentation.map(
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
            {venueId &&
              futureOrOngoingVenueEvents &&
              futureOrOngoingVenueEvents.length > 0 && (
                <>
                  <div className="upcoming-gigs-title">Upcoming gigs</div>
                  {futureOrOngoingVenueEvents.map((venueEvent) => {
                    const startingDate = new Date(
                      venueEvent.start_utc_seconds * 1000
                    );
                    const endingDate = new Date(
                      (venueEvent.start_utc_seconds +
                        60 * venueEvent.duration_minutes) *
                        1000
                    );
                    const isNextVenueEvent = venueEvent.id === nextVenueEventId;
                    const hasUserBoughtTicket =
                      user &&
                      (hasUserBoughtTicketForEvent(
                        purchaseHistory,
                        venueEvent.id
                      ) ||
                        isUserAMember(user.email, venue.config?.memberEmails));
                    return (
                      <InformationCard
                        title={venueEvent.name}
                        key={venueEvent.id}
                        className={`${!isNextVenueEvent ? "disabled" : ""}`}
                      >
                        <div className="date">
                          {`${dayjs(startingDate).format("ha")}-${dayjs(
                            endingDate
                          ).format("ha")} ${dayjs(startingDate).format(
                            "dddd MMMM Do"
                          )}`}
                        </div>
                        <div className="event-description">
                          {venueEvent.description}
                          {venueEvent.descriptions?.map(
                            (description, index) => (
                              <p key={index}>{description}</p>
                            )
                          )}
                        </div>
                        <div className="button-container">
                          {hasUserBoughtTicket ? (
                            <div>
                              <div>You have a ticket for this event</div>
                              <CountDown
                                startUtcSeconds={venueEvent.start_utc_seconds}
                              />
                            </div>
                          ) : (
                            <div className="price-container">
                              Individual tickets £{venueEvent.price / 100}
                              <br />
                              Group tickets £{venueEvent.collective_price / 100}
                              {!user && (
                                <div className="login-invitation">
                                  {"Already have a ticket? "}
                                  <span
                                    className="link"
                                    onClick={openAuthenticationModal}
                                  >
                                    Log in
                                  </span>
                                  .
                                </div>
                              )}
                            </div>
                          )}

                          {user ? (
                            <EventPaymentButton
                              event={venueEvent}
                              venueId={venueId}
                              isUserVenueOwner={!!isUserVenueOwner}
                              selectEvent={() => setSelectedEvent(venueEvent)}
                              setIsPaymentModalOpen={setIsPaymentModalOpen}
                              paymentConfirmationPending={
                                eventPaidSuccessfully === venueEvent.id
                              }
                            />
                          ) : (
                            <button
                              className="btn btn-primary buy-tickets-button"
                              onClick={() => {
                                setSelectedEvent(venueEvent);
                                openAuthenticationModal();
                              }}
                            >
                              Buy tickets
                            </button>
                          )}
                        </div>
                      </InformationCard>
                    );
                  })}
                </>
              )}
            {isUserVenueOwner && (
              <InformationCard title="Check how an event looks like in your venue">
                <div className="button-container">
                  <div>This is a fake event. Only you can see it.</div>
                  <Link to={venueInsideUrl(venueId)}>
                    <button role="link" className="btn btn-primary">
                      Enter as an admin
                    </button>
                  </Link>
                </div>
              </InformationCard>
            )}
          </div>
        </div>
      </div>
      {user && selectedEvent && (
        <PaymentModal
          selectedEvent={selectedEvent}
          show={isPaymentModalOpen}
          onHide={closePaymentModal}
          setEventPaidSuccessfully={setEventPaidSuccessfully}
          eventPaidSuccessfully={eventPaidSuccessfully}
        />
      )}
      <AuthenticationModal
        show={isAuthenticationModalOpen}
        onHide={closeAuthenticationModal}
        afterUserIsLoggedIn={() => setShouldOpenPaymentModal(true)}
        showAuth="register"
      />
    </WithNavigationBar>
  );
};
