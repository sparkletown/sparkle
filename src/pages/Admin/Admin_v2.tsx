import AuthenticationModal from "components/organisms/AuthenticationModal";
import WithNavigationBar from "components/organisms/WithNavigationBar";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import "firebase/storage";
import { useKeyedSelector, useSelector } from "hooks/useSelector";
import { useUser } from "hooks/useUser";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useFirestoreConnect } from "react-redux-firebase";
import {
  Link,
  Route,
  Switch,
  useLocation,
  useParams,
  useRouteMatch,
  useHistory,
} from "react-router-dom";
import { AdminVenueDetailsPartProps, VenueEvent } from "types/VenueEvent";
import { WithId } from "utils/id";
import {
  canHaveSubvenues,
  canBeDeleted,
  canHaveEvents,
  canHavePlacement,
} from "utils/venue";
import "./Admin.scss";
import AdminEventModal from "./AdminEventModal";
import { venueInsideUrl } from "utils/url";
import { AdminVenuePreview } from "./AdminVenuePreview";
import { useQuery } from "hooks/useQuery";
import { VenueTemplate } from "types/VenueTemplate";
import VenueDeleteModal from "./Venue/VenueDeleteModal";
import { PlayaContainer } from "pages/Account/Venue/VenueMapEdition";
import {
  PLACEABLE_VENUE_TEMPLATES,
  PLAYA_IMAGE,
  PLAYA_VENUE_SIZE,
  PLAYA_VENUE_STYLES,
  PLAYA_VENUE_NAME,
  PLAYA_WIDTH,
  PLAYA_HEIGHT,
  HAS_ROOMS_TEMPLATES,
} from "settings";
import { VenueOwnersModal } from "./VenueOwnersModal";
import useRoles from "hooks/useRoles";
import { IS_BURN } from "secrets";
import EventsComponent from "./EventsComponent";
import AdminDeleteEvent from "./AdminDeleteEvent";
import { orderedVenuesSelector } from "utils/selectors";
import { AuthOptions } from "components/organisms/AuthenticationModal/AuthenticationModal";

dayjs.extend(advancedFormat);

type VenueListProps = {
  selectedVenueId?: string;
  roomIndex?: number;
};

const VenueList: React.FC<VenueListProps> = ({
  selectedVenueId,
  roomIndex,
}) => {
  const venues = useSelector(orderedVenuesSelector);

  if (!venues) return <>Loading...</>;

  return (
    <>
      <div className="page-container-adminsidebar-title title">My Venues</div>
      <div className="page-container-adminsidebar-top">
        <Link to="/admin_v2/venue/creation" className="btn btn-primary">
          Create a venue
        </Link>
      </div>
      <ul className="page-container-adminsidebar-venueslist">
        {venues.map((venue, index) => (
          <li
            key={index}
            className={`${selectedVenueId === venue.id ? "selected" : ""} ${
              canHaveSubvenues(venue) ? "camp" : ""
            }`}
          >
            <Link to={`/admin_v2/venue/${venue.id}`}>{venue.name}</Link>
            {HAS_ROOMS_TEMPLATES.includes(venue.template) && (
              <ul className="page-container-adminsidebar-subvenueslist">
                {venue.rooms &&
                  venue.rooms?.length > 0 &&
                  venue.rooms?.map((room, idx) => (
                    <li
                      key={idx}
                      className={`${idx === roomIndex ? "selected" : ""}`}
                    >
                      <Link to={`/admin_v2/venue/${venue.id}?roomIndex=${idx}`}>
                        {room.title}
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
  roomIndex?: number;
};

const VenueDetails: React.FC<VenueDetailsProps> = ({ venueId, roomIndex }) => {
  const match = useRouteMatch();
  const location = useLocation();
  const { venues } = useKeyedSelector(
    (state) => ({
      venues: state.firestore.data.venues ?? {},
    }),
    ["venues"]
  );

  const venue = venues[venueId];
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [showDeleteEventModal, setShowDeleteEventModal] = useState(false);
  const [editedEvent, setEditedEvent] = useState<WithId<VenueEvent>>();

  if (!venue) {
    return <>{`Oops, seems we can't find your venue!`}</>;
  }

  const tabs = [{ url: `${match.url}`, label: "Venue Info" }];
  if (canHaveEvents(venue)) {
    tabs.push({ url: `${match.url}/events`, label: "Events" });
  }
  if (canHavePlacement(venue)) {
    tabs.push({ url: `${match.url}/placement`, label: "Placement & Editing" });
  }

  return (
    <>
      <div className="page-container-adminpanel-tabs">
        {tabs.map((tab) => (
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
            render={() => (
              <EventsComponent
                venue={venue}
                showCreateEventModal={showCreateEventModal}
                setShowCreateEventModal={setShowCreateEventModal}
                editedEvent={editedEvent}
                setEditedEvent={setEditedEvent}
              />
            )}
            venue={venue}
          />
          <Route
            path={`${match.url}/Appearance`}
            render={() => <>Appearance Component</>}
          />
          <Route
            path={`${match.url}`}
            render={() => (
              <VenueInfoComponent
                venue={venue}
                roomIndex={roomIndex}
                showCreateEventModal={showCreateEventModal}
                setShowCreateEventModal={setShowCreateEventModal}
                setShowDeleteEventModal={setShowDeleteEventModal}
              />
            )}
          />
        </Switch>
      </div>
      <AdminEventModal
        show={showCreateEventModal}
        onHide={() => {
          setShowCreateEventModal(false);
          setEditedEvent(undefined);
        }}
        venueId={venue.id}
        event={editedEvent}
        template={venue.template}
        setEditedEvent={setEditedEvent}
        setShowDeleteEventModal={setShowDeleteEventModal}
      />
      <AdminDeleteEvent
        show={showDeleteEventModal}
        onHide={() => {
          setShowDeleteEventModal(false);
          setEditedEvent && setEditedEvent(undefined);
        }}
        venueId={venue.id}
        event={editedEvent}
      />
    </>
  );
};

const VenueInfoComponent: React.FC<AdminVenueDetailsPartProps> = ({
  venue,
  roomIndex,
  showCreateEventModal,
  setShowCreateEventModal,
  setShowDeleteEventModal,
}) => {
  const queryParams = useQuery();
  const manageUsers = !!queryParams.get("manageUsers");
  const { push } = useHistory();
  const onManageUsersModalHide = useCallback(() => push({ search: "" }), [
    push,
  ]);
  const history = useHistory();
  const match = useRouteMatch();
  const placementDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clientWidth = placementDivRef.current?.clientWidth ?? 0;
    const clientHeight = placementDivRef.current?.clientHeight ?? 0;

    placementDivRef.current?.scrollTo(
      (venue.placement?.x ?? 0) - clientWidth / 2,
      (venue.placement?.y ?? 0) - clientHeight / 2
    );
  }, [venue]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editedEvent, setEditedEvent] = useState<WithId<VenueEvent>>();
  const visitText =
    venue.template === VenueTemplate.themecamp ? "Visit camp" : "Visit venue";
  const editText =
    venue.template === VenueTemplate.themecamp ? "Edit camp" : "Edit venue";
  const deleteText =
    venue.template === VenueTemplate.themecamp ? "Delete camp" : "Delete venue";

  return (
    <>
      <div className="page-container-adminpanel-content">
        {/* after delete venue becomes {id: string} */}
        {venue.name && (
          <>
            <AdminVenuePreview
              venue={venue}
              containerStyle={{ marginTop: 20 }}
            />
            {IS_BURN && PLACEABLE_VENUE_TEMPLATES.includes(venue.template) && (
              <>
                <h4
                  className="italic"
                  style={{ fontSize: "30px", textAlign: "center" }}
                >
                  How your experience appears on the {PLAYA_VENUE_NAME}
                </h4>
                <div className="container venue-entrance-experience-container">
                  <div
                    className="playa-container"
                    ref={placementDivRef}
                    style={{ width: "100%", height: 1000, overflow: "scroll" }}
                  >
                    <PlayaContainer
                      rounded
                      interactive={false}
                      resizable={false}
                      iconsMap={
                        venue.placement && venue.mapIconImageUrl
                          ? {
                              icon: {
                                width: PLAYA_VENUE_SIZE,
                                height: PLAYA_VENUE_SIZE,
                                top: venue.placement.y,
                                left: venue.placement.x,
                                url: venue.mapIconImageUrl,
                              },
                            }
                          : {}
                      }
                      coordinatesBoundary={{
                        width: PLAYA_WIDTH,
                        height: PLAYA_HEIGHT,
                      }}
                      backgroundImage={PLAYA_IMAGE}
                      iconImageStyle={PLAYA_VENUE_STYLES.iconImage}
                      draggableIconImageStyle={
                        PLAYA_VENUE_STYLES.draggableIconImage
                      }
                      containerStyle={{
                        width: PLAYA_WIDTH,
                        height: PLAYA_HEIGHT,
                      }}
                      venueId={venue.id}
                      otherIconsStyle={{ opacity: 0.4 }}
                    />
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
      <div className="page-container-adminpanel-actions">
        {/* after delete venue becomes {id: string} */}
        {venue.name && (
          <>
            <Link
              to={venueInsideUrl(venue.id)}
              target="_blank"
              rel="noopener noreferer"
              className="btn btn-primary btn-block"
            >
              {visitText}
            </Link>
            <Link
              to={`/admin_v2/venue/edit/${venue.id}`}
              className="btn btn-block"
            >
              {editText}
            </Link>
            {canHaveSubvenues(venue) && (
              <Link
                to={`/admin_v2/venue/rooms/${venue.id}`}
                className="btn btn-block"
              >
                Add a Room
              </Link>
            )}
            {HAS_ROOMS_TEMPLATES.includes(venue.template) &&
              typeof roomIndex !== "undefined" && (
                <Link
                  to={`/admin_v2/venue/rooms/${venue.id}?roomIndex=${roomIndex}`}
                  className="btn btn-block"
                >
                  Edit Room
                </Link>
              )}
            {canBeDeleted(venue) && (
              <button
                role="link"
                className="btn btn-block btn-danger"
                onClick={() => setShowDeleteModal(true)}
              >
                {deleteText}
              </button>
            )}
            <button
              className="btn btn-primary"
              onClick={() => {
                history.push(`${match.url}/events`);
                setShowCreateEventModal(true);
              }}
              style={{ marginBottom: 10, width: "100%" }}
            >
              Create an Event
            </button>
            <Link
              to={{ search: "manageUsers=true" }}
              className="btn btn-primary"
            >
              Manage Venue Owners
            </Link>
            {typeof roomIndex !== "number" && (
              <div>
                If you are looking to edit one of your rooms, please select the
                room in the left hand menu
              </div>
            )}
          </>
        )}
      </div>
      <VenueDeleteModal
        show={showDeleteModal}
        onHide={() => {
          setShowDeleteModal(false);
        }}
        venue={venue}
      />
      <VenueOwnersModal
        visible={manageUsers}
        onHide={onManageUsersModalHide}
        venue={venue}
      />
      <AdminEventModal
        show={showCreateEventModal}
        onHide={() => {
          setShowCreateEventModal(false);
          setEditedEvent(undefined);
        }}
        venueId={venue.id}
        event={editedEvent}
        template={venue.template}
        setEditedEvent={setEditedEvent}
        setShowDeleteEventModal={setShowDeleteEventModal}
      />
    </>
  );
};

const Admin: React.FC = () => {
  const { user } = useUser();
  const { venueId } = useParams<{ venueId: string }>();
  const queryParams = useQuery();
  const queryRoomIndexString = queryParams.get("roomIndex");
  const queryRoomIndex = queryRoomIndexString
    ? parseInt(queryRoomIndexString)
    : undefined;

  useFirestoreConnect([
    {
      collection: "venues",
      where: [["owners", "array-contains", user?.uid || ""]],
    },
  ]);
  const { roles } = useRoles();
  if (!roles) {
    return <>Loading...</>;
  }
  if (!IS_BURN && !roles.includes("admin")) {
    return <>Forbidden</>;
  }

  return (
    <WithNavigationBar fullscreen>
      <div className="admin-dashboard">
        <AuthenticationModal
          show={!user}
          onHide={() => {}}
          showAuth={AuthOptions.login}
        />
        <div className="page-container page-container_adminview">
          <div className="page-container-adminsidebar">
            <VenueList selectedVenueId={venueId} roomIndex={queryRoomIndex} />
          </div>
          <div className="page-container-adminpanel">
            {venueId ? (
              <VenueDetails venueId={venueId} roomIndex={queryRoomIndex} />
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
