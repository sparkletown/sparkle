import React, { useState } from "react";
import "firebase/storage";
import "./Account.scss";
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
import { createUrlSafeName } from "api/admin";

type VenueListProps = {
  selectedVenueId?: string;
};

const VenueList: React.FC<VenueListProps> = ({ selectedVenueId }) => {
  const venues = useSelector((state) => state.firestore.ordered.venues);
  return (
    <>
      <h4>My Venues</h4>
      <ul>
        {venues?.map((venue) => (
          <li
            key={venue.id}
            style={venue.id === selectedVenueId ? { color: "red " } : {}}
          >
            <Link to={`/admin/venue/${venue.id}`}>{venue.name}</Link>
          </li>
        ))}
      </ul>
      <div className="centered-flex">
        <Link className="btn btn-primary" to="/admin/venue/creation">
          Create a venue
        </Link>
      </div>
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
    return <>Oops, seems we can't find your venue!</>;
  }

  return (
    <>
      <ul>
        {[
          { url: `${match.url}`, label: "Venue Infos" },
          { url: `${match.url}/appearance`, label: "Appearance" },
          { url: `${match.url}/events`, label: "Events" },
        ].map((l) => (
          <li
            key={l.url}
            style={location.pathname === l.url ? { color: "red" } : {}}
          >
            <Link to={l.url}>{l.label}</Link>
          </li>
        ))}
      </ul>
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
    </>
  );
};

const VenueInfosComponent: React.FC<VenueDetailsPartProps> = ({ venue }) => {
  return (
    <>
      <Link
        to={`/v/${createUrlSafeName(venue.name)}`}
        target="_blank"
        rel="noopener noreferer"
      >
        Preview
      </Link>
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

  return (
    <>
      <ul>
        {events?.map((event) => (
          <li key={event.id}>
            {event.name} - {event.description} (£{event.price})
          </li>
        ))}
      </ul>
      <div className="centered-flex">
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
        }}
        venueId={venue.id}
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
      where: [["owners", "array-contains", user?.uid]],
    },
  ]);

  return (
    <WithNavigationBar>
      <div className="container admin-container">
        <AuthenticationModal show={!user} onHide={() => {}} showAuth="login" />
        <div className="title">Admin</div>
        <div style={{ flex: "1", flexDirection: "row", display: "flex" }}>
          <div style={{ flex: "0 0 auto", border: "red solid 1px" }}>
            <VenueList selectedVenueId={venueId} />
          </div>
          <div style={{ flex: "1 1 auto", border: "red solid 1px" }}>
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
