import InformationCard from "components/molecules/InformationCard";
import AuthenticationModal from "components/organisms/AuthenticationModal";
import VenuePreview from "components/organisms/VenuePreview";
import WithNavigationBar from "components/organisms/WithNavigationBar";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import "firebase/storage";
import { useKeyedSelector, useSelector } from "hooks/useSelector";
import { useUser } from "hooks/useUser";
import React, { useMemo, useState } from "react";
import { useFirestoreConnect } from "react-redux-firebase";
import {
  Link,
  Route,
  Switch,
  useLocation,
  useParams,
  useRouteMatch,
} from "react-router-dom";
import { Venue } from "types/Venue";
import { VenueEvent } from "types/VenueEvent";
import { WithId } from "utils/id";
import { canHaveSubvenues } from "utils/venue";
import "./Admin.scss";
import AdminEvent from "./AdminEvent";
import AdminDeleteEvent from "./AdminDeleteEvent";

dayjs.extend(advancedFormat);

type VenueListProps = {
  selectedVenueId?: string;
};

const VenueList: React.FC<VenueListProps> = ({ selectedVenueId }) => {
  const { venues } = useSelector((state) => ({
    venues: state.firestore.ordered.venues,
  }));

  const topLevelVenues = useMemo(
    () => venues?.filter((v) => v.parentId === undefined) ?? [],
    [venues]
  );

  return (
    <>
      <div className="page-container-adminsidebar-title">My Venues</div>
      <div className="page-container-adminsidebar-top">
        <Link to="/admin/venue/creation" className="btn btn-primary">
          Create a venue
        </Link>
      </div>
      <ul className="page-container-adminsidebar-venueslist">
        {topLevelVenues.map((venue) => (
          <li
            key={venue.id}
            className={`${selectedVenueId === venue.id ? "selected" : ""} ${
              canHaveSubvenues(venue) ? "camp" : ""
            }`}
          >
            <Link to={`/admin/venue/${venue.id}`}>{venue.name}</Link>
            {canHaveSubvenues(venue) && (
              <ul className="page-container-adminsidebar-subvenueslist">
                {venues
                  ?.filter((subVenue) => subVenue.parentId === venue.id)
                  .map((subVenue) => (
                    <li
                      key={`${venue.id}-${subVenue.id}`}
                      className={`${
                        selectedVenueId === subVenue.id ? "selected" : ""
                      }`}
                    >
                      <Link to={`/admin/venue/${subVenue.id}`}>
                        {subVenue.name}
                      </Link>
                    </li>
                  ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </>
  );
};

type VenueDetailsProps = {
  venueId: string;
};

type VenueDetailsPartProps = {
  venue: WithId<Venue>;
};

const VenueDetails: React.FC<VenueDetailsProps> = ({ venueId }) => {
  const match = useRouteMatch();
  const location = useLocation();
  const { venues } = useKeyedSelector(
    (state) => ({
      venues: state.firestore.data.venues ?? {},
    }),
    ["venues"]
  );

  const venue = venues[venueId];

  if (!venue) {
    return <>{`Oops, seems we can't find your venue!`}</>;
  }

  return (
    <>
      <div className="page-container-adminpanel-tabs">
        {[
          { url: `${match.url}`, label: "Venue Info" },
          { url: `${match.url}/events`, label: "Events" },
        ].map((tab) => (
          <div
            key={tab.url}
            className={`page-container-adminpanel-tab ${
              location.pathname === tab.url ? "selected" : ""
            }`}
          >
            <Link to={tab.url}>{tab.label}</Link>
          </div>
        ))}
      </div>
      <div className="page-container-adminpanel-venuepage">
        <Switch>
          <Route
            path={`${match.url}/events`}
            render={() => <EventsComponent venue={venue} />}
            venue={venue}
          />
          <Route
            path={`${match.url}/Appearance`}
            component={() => <>Appearance Component</>}
          />
          <Route
            path={`${match.url}`}
            component={() => <VenueInfoComponent venue={venue} />}
          />
        </Switch>
      </div>
    </>
  );
};

const VenueInfoComponent: React.FC<VenueDetailsPartProps> = ({ venue }) => {
  return (
    <>
      <div className="page-container-adminpanel-content">
        <h3 style={{ textAlign: "center" }}>
          How your space appears on the playa
        </h3>
        <div className="container venue-entrance-experience-container">
          <div className="playa-container">
            <div className="playa-abs-container">
              <div style={{ marginLeft: -500, position: "relative" }}>
                <img
                  src={venue.mapIconImageUrl ?? venue.host.icon}
                  alt={"host icon"}
                  className="playa-icon"
                />
                <div className="playa-marketing-preview">
                  <VenuePreview values={venue} />
                </div>
              </div>
            </div>
            <img
              src={"/burn/playa3d.jpeg"}
              alt="playa"
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        </div>
      </div>
      <div className="page-container-adminpanel-actions">
        <Link
          to={`/in/${venue.id}`}
          target="_blank"
          rel="noopener noreferer"
          className="btn btn-primary btn-block"
        >
          Visit venue
        </Link>
        <Link to={`/admin/venue/edit/${venue.id}`} className="btn btn-block">
          Edit venue
        </Link>
        {canHaveSubvenues(venue) && (
          <Link to="#" className="btn btn-block">
            Add a subvenue
          </Link>
        )}
      </div>
    </>
  );
};

const EventsComponent: React.FC<VenueDetailsPartProps> = ({ venue }) => {
  useFirestoreConnect([
    {
      collection: "venues",
      doc: venue.id,
      subcollections: [{ collection: "events" }],
      orderBy: ["start_utc_seconds", "desc"],
      storeAs: "events",
    },
  ]);

  const events = useSelector((state) => state.firestore.ordered.events);
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [showDeleteEventModal, setShowDeleteEventModal] = useState(false);
  const [editedEvent, setEditedEvent] = useState<WithId<VenueEvent>>();

  return (
    <>
      <div className="page-container-adminpanel-content">
        <div className="col-lg-6 col-12 oncoming-events">
          {events && (
            <>
              {events.map((venueEvent) => {
                const startingDate = new Date(
                  venueEvent.start_utc_seconds * 1000
                );
                const endingDate = new Date(
                  (venueEvent.start_utc_seconds +
                    60 * venueEvent.duration_minutes) *
                    1000
                );
                return (
                  <InformationCard title={venueEvent.name} key={venueEvent.id}>
                    <div className="date">
                      {`${dayjs(startingDate).format("ha")}-${dayjs(
                        endingDate
                      ).format("ha")} ${dayjs(startingDate).format(
                        "dddd MMMM Do"
                      )}`}
                    </div>
                    <div className="event-description">
                      {venueEvent.description}
                      {venueEvent.descriptions?.map((description, index) => (
                        <p key={index}>{description}</p>
                      ))}
                    </div>
                    <div className="button-container">
                      <div className="price-container">
                        {venueEvent.price > 0 && (
                          <>Individual tickets £{venueEvent.price / 100}</>
                        )}
                      </div>
                      <div className="event-payment-button-container">
                        <div>
                          <button
                            role="link"
                            className="btn btn-primary buy-tickets-button"
                            onClick={() => {
                              setEditedEvent(venueEvent);
                              setShowCreateEventModal(true);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            role="link"
                            className="btn btn-primary buy-tickets-button"
                            onClick={() => {
                              setEditedEvent(venueEvent);
                              setShowDeleteEventModal(true);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </InformationCard>
                );
              })}
            </>
          )}
        </div>
      </div>
      <div className="page-container-adminpanel-actions">
        <button
          className="btn btn-primary"
          onClick={() => setShowCreateEventModal(true)}
        >
          Create an Event
        </button>
      </div>
      <AdminEvent
        show={showCreateEventModal}
        onHide={() => {
          setShowCreateEventModal(false);
          setEditedEvent(undefined);
        }}
        venueId={venue.id}
        event={editedEvent}
      />
      <AdminDeleteEvent
        show={showDeleteEventModal}
        onHide={() => {
          setShowDeleteEventModal(false);
          setEditedEvent(undefined);
        }}
        venueId={venue.id}
        event={editedEvent}
      />
    </>
  );
};

const Admin: React.FC = () => {
  const { user } = useUser();
  const { venueId } = useParams();

  useFirestoreConnect([
    {
      collection: "venues",
      where: [["owners", "array-contains", user?.uid || ""]],
    },
  ]);

  return (
    <WithNavigationBar>
      <div className="admin-dashboard">
        <AuthenticationModal show={!user} onHide={() => {}} showAuth="login" />
        <div className="page-container page-container_adminview">
          <div className="page-container-adminsidebar">
            <VenueList selectedVenueId={venueId} />
          </div>
          <div className="page-container-adminpanel">
            {venueId ? (
              <VenueDetails venueId={venueId} />
            ) : (
              <>Select a venue to see its details</>
            )}
          </div>
        </div>
      </div>
    </WithNavigationBar>
  );
};

export default Admin;
