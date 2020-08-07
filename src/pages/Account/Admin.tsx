import React, { useMemo, useState } from "react";
import "firebase/storage";
import "./Admin.scss";
import { useUser } from "hooks/useUser";
import AuthenticationModal from "components/organisms/AuthenticationModal";
import AdminEvent from "./AdminEvent";
import WithNavigationBar from "components/organisms/WithNavigationBar";
import {
  Link,
  useParams,
  Switch,
  Route,
  useRouteMatch,
  useLocation,
} from "react-router-dom";
import { useFirestoreConnect } from "react-redux-firebase";
import { useSelector, useKeyedSelector } from "hooks/useSelector";
import { Venue } from "types/Venue";
import { WithId } from "utils/id";
import InformationCard from "components/molecules/InformationCard";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { VenueEvent } from "types/VenueEvent";
import { canHaveSubvenues } from "utils/venue";
import { EntranceExperiencePreviewProvider } from "components/templates/EntranceExperienceProvider";
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
            component={() => <VenueInfosComponent venue={venue} />}
          />
        </Switch>
      </div>
    </>
  );
};

const VenueInfosComponent: React.FC<VenueDetailsPartProps> = ({ venue }) => {
  return (
    <>
      <div className="page-container-adminpanel-content">
        <h3 style={{ textAlign: "center" }}>
          How your camp appears on the Playa
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
                  <EntranceExperiencePreviewProvider
                    venueRequestStatus
                    venue={venue}
                  />
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
          to={`/v/${venue.id}`}
          target="_blank"
          rel="noopener noreferer"
          className="btn btn-primary btn-block"
        >
          Visit preview page
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
                        Individual tickets £{venueEvent.price / 100}
                      </div>
                      <div className="event-payment-button-container">
                        <div>
                          <button
                            role="link"
                            className="btn btn-primary buy-tickets-button"
                            onClick={() => {
                              setShowCreateEventModal(true);
                              setEditedEvent(venueEvent);
                            }}
                          >
                            Edit
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
