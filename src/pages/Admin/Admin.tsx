import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { shallowEqual } from "react-redux";
import {
  Link,
  Route,
  Switch,
  useLocation,
  useParams,
  useRouteMatch,
  useHistory,
  Redirect,
} from "react-router-dom";
import {
  ReduxFirestoreQuerySetting,
  useFirestoreConnect,
} from "react-redux-firebase";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import "firebase/storage";

import {
  PLACEABLE_VENUE_TEMPLATES,
  PLAYA_IMAGE,
  PLAYA_VENUE_SIZE,
  PLAYA_VENUE_STYLES,
  PLAYA_VENUE_NAME,
  PLAYA_WIDTH,
  PLAYA_HEIGHT,
  DEFAULT_VENUE,
} from "settings";
import { IS_BURN } from "secrets";

import { isVenueWithRooms } from "types/CampVenue";
import { AdminVenueDetailsPartProps, VenueEvent } from "types/VenueEvent";
import { VenueTemplate } from "types/VenueTemplate";

import { isTruthyFilter } from "utils/filter";
import { WithId } from "utils/id";
import { makeVenueSelector, orderedVenuesSelector } from "utils/selectors";
import { venueInsideUrl } from "utils/url";
import {
  canHaveSubvenues,
  canBeDeleted,
  canHaveEvents,
  canHavePlacement,
} from "utils/venue";

import { useIsAdminUser } from "hooks/roles";
import { useSelector } from "hooks/useSelector";
import { useQuery } from "hooks/useQuery";
import { useUser } from "hooks/useUser";

import AuthenticationModal from "components/organisms/AuthenticationModal";
import WithNavigationBar from "components/organisms/WithNavigationBar";

import AdminDeleteEvent from "./AdminDeleteEvent";
import AdminEditComponent from "./AdminEditComponent";
import AdminEventModal from "./AdminEventModal";
import { AdminVenuePreview } from "./AdminVenuePreview";
import EventsComponent from "./EventsComponent";
import { PlayaContainer } from "pages/Account/Venue/VenueMapEdition";
import VenueDeleteModal from "./Venue/VenueDeleteModal";
import { VenueOwnersModal } from "./VenueOwnersModal";

import "./Admin.scss";

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
        <Link to="/admin/venue/creation" className="btn btn-primary">
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
            <Link to={`/admin/venue/${venue.id}`}>{venue.name}</Link>
            {isVenueWithRooms(venue) && (
              <ul className="page-container-adminsidebar-subvenueslist">
                {venue.rooms?.map((room, idx) => (
                  <li
                    key={idx}
                    className={`${idx === roomIndex ? "selected" : ""}`}
                  >
                    <Link to={`/admin/venue/${venue.id}?roomIndex=${idx}`}>
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
  const { url: matchUrl } = useRouteMatch();
  const { pathname: urlPath } = useLocation();

  const venueSelector = useCallback(
    (state) => makeVenueSelector(venueId)(state),
    [venueId]
  );
  const venue = useSelector(venueSelector, shallowEqual);

  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [showDeleteEventModal, setShowDeleteEventModal] = useState(false);
  const [editedEvent, setEditedEvent] = useState<WithId<VenueEvent>>();

  const adminEventModalOnHide = useCallback(() => {
    setShowCreateEventModal(false);
    setEditedEvent(undefined);
  }, []);

  const adminDeleteEventOnHide = useCallback(() => {
    setShowDeleteEventModal(false);
    setEditedEvent && setEditedEvent(undefined);
  }, []);

  const tabs = useMemo(() => {
    if (!venue) return [];

    return [
      { url: matchUrl, label: "Venue Info" },
      canHaveEvents(venue) && { url: `${matchUrl}/events`, label: "Events" },
      canHavePlacement(venue) && {
        url: `${matchUrl}/placement`,
        label: "Placement & Editing",
      },
    ].filter(isTruthyFilter);
  }, [matchUrl, venue]);

  if (!venue) {
    return <>{"Oops, seems we can't find your venue!"}</>;
  }

  return (
    <>
      <div className="page-container-adminpanel-tabs">
        {tabs.map((tab) => (
          <div
            key={tab.url}
            className={`page-container-adminpanel-tab ${
              urlPath === tab.url ? "selected" : ""
            }`}
          >
            <Link to={tab.url}>{tab.label}</Link>
          </div>
        ))}
      </div>
      <div className="page-container-adminpanel-venuepage">
        <Switch>
          <Route path={`${matchUrl}/events`}>
            <EventsComponent
              venue={venue}
              showCreateEventModal={showCreateEventModal}
              setShowCreateEventModal={setShowCreateEventModal}
              editedEvent={editedEvent}
              setEditedEvent={setEditedEvent}
            />
          </Route>
          <Route path={`${matchUrl}/placement`}>
            <AdminEditComponent />
          </Route>
          <Route path={`${matchUrl}/Appearance`}>
            <>Appearance Component</>
          </Route>
          <Route path={matchUrl}>
            <VenueInfoComponent
              venue={venue}
              roomIndex={roomIndex}
              showCreateEventModal={showCreateEventModal}
              setShowCreateEventModal={setShowCreateEventModal}
              setShowDeleteEventModal={setShowDeleteEventModal}
            />
          </Route>
        </Switch>
      </div>
      <AdminEventModal
        show={showCreateEventModal}
        onHide={adminEventModalOnHide}
        venueId={venueId}
        event={editedEvent}
        template={venue.template}
        setEditedEvent={setEditedEvent}
        setShowDeleteEventModal={setShowDeleteEventModal}
      />
      <AdminDeleteEvent
        show={showDeleteEventModal}
        onHide={adminDeleteEventOnHide}
        venueId={venueId}
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
              to={`/admin/venue/edit/${venue.id}`}
              className="btn btn-block"
            >
              {editText}
            </Link>
            {canHaveSubvenues(venue) && (
              <Link
                to={`/admin/venue/rooms/${venue.id}`}
                className="btn btn-block"
              >
                Add a Room
              </Link>
            )}
            {isVenueWithRooms(venue) && typeof roomIndex !== "undefined" && (
              <Link
                to={`/admin/venue/rooms/${venue.id}?roomIndex=${roomIndex}`}
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
  const userId = user?.uid || "";

  const { isAdminUser, isLoading: isAdminUserLoading } = useIsAdminUser(userId);

  const venuesOwnedByUserQuery = useMemo<ReduxFirestoreQuerySetting>(
    () => ({
      collection: "venues",
      where: [["owners", "array-contains", userId]],
    }),
    [userId]
  );
  useFirestoreConnect(venuesOwnedByUserQuery);

  const { venueId } = useParams();
  const queryParams = useQuery();
  const queryRoomIndexString = queryParams.get("roomIndex");
  const queryRoomIndex = queryRoomIndexString
    ? parseInt(queryRoomIndexString)
    : undefined;

  if (isAdminUserLoading) return <>Loading...</>;
  if (!IS_BURN && !isAdminUser) return <>Forbidden</>;

  if (!user) {
    return <Redirect to={`/in/${DEFAULT_VENUE}`} />;
  }

  return (
    <WithNavigationBar fullscreen>
      <div className="admin-dashboard">
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
