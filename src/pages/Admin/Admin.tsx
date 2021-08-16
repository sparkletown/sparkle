import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Link,
  Redirect,
  Route,
  Switch,
  useHistory,
  useLocation,
  useRouteMatch,
} from "react-router-dom";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

import { IS_BURN } from "secrets";

import {
  DEFAULT_VENUE,
  PLACEABLE_VENUE_TEMPLATES,
  PLAYA_HEIGHT,
  PLAYA_IMAGE,
  PLAYA_VENUE_NAME,
  PLAYA_VENUE_SIZE,
  PLAYA_VENUE_STYLES,
  PLAYA_WIDTH,
} from "settings";

import { ValidStoreAsKeys } from "types/Firestore";
import { AnyVenue, isVenueWithRooms, VenueEvent } from "types/venues";

import { isTruthyFilter } from "utils/filter";
import { WithId } from "utils/id";
import { venueInsideUrl } from "utils/url";
import {
  canBeDeleted,
  canHaveEvents,
  canHavePlacement,
  canHaveSubvenues,
} from "utils/venue";

import { useIsAdminUser } from "hooks/roles";
import { useOwnedVenues } from "hooks/useConnectOwnedVenues";
import { useFirestoreConnect } from "hooks/useFirestoreConnect";
import { useQuery } from "hooks/useQuery";
import { useShowHide } from "hooks/useShowHide";
import { useUser } from "hooks/useUser";
import { useVenueId } from "hooks/useVenueId";

import { PlayaContainer } from "pages/Account/Venue/VenueMapEdition";

import WithNavigationBar from "components/organisms/WithNavigationBar";

import { Loading } from "components/molecules/Loading";

import "firebase/storage";

import VenueDeleteModal from "./Venue/VenueDeleteModal";
import AdminDeleteEvent from "./AdminDeleteEvent";
import AdminEventModal from "./AdminEventModal";
import { AdminVenuePreview } from "./AdminVenuePreview";
import EventsComponent from "./EventsComponent";
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
  const { isLoading, ownedVenues } = useOwnedVenues({
    currentVenueId: selectedVenueId,
  });

  if (isLoading) return <Loading />;

  return (
    <>
      <div className="page-container-adminsidebar-title title">My Venues</div>
      <div className="page-container-adminsidebar-top">
        <Link to="/admin/venue/creation" className="btn btn-primary">
          Create a venue
        </Link>
      </div>
      <ul className="page-container-adminsidebar-venueslist">
        {ownedVenues.map((venue) => (
          <li
            key={venue.id}
            className={`${selectedVenueId === venue.id ? "selected" : ""} ${
              canHaveSubvenues(venue) ? "space" : ""
            }`}
          >
            <Link to={`/admin/${venue.id}`}>{venue.name}</Link>
            {isVenueWithRooms(venue) && (
              <ul className="page-container-adminsidebar-subvenueslist">
                {venue.rooms?.map((room, idx) => (
                  <li
                    key={idx}
                    className={`${idx === roomIndex ? "selected" : ""}`}
                  >
                    <Link to={`/admin/${venue.id}?roomIndex=${idx}`}>
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

  const { currentVenue } = useOwnedVenues({ currentVenueId: venueId });

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
    if (!currentVenue) return [];

    return [
      { url: matchUrl, label: "Venue Info" },
      canHaveEvents(currentVenue) && {
        url: `${matchUrl}/events`,
        label: "Events",
      },
      canHavePlacement(currentVenue) && {
        url: `${matchUrl}/placement`,
        label: "Placement & Editing",
      },
    ].filter(isTruthyFilter);
  }, [matchUrl, currentVenue]);

  if (!currentVenue) {
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
              venue={currentVenue}
              setShowCreateEventModal={setShowCreateEventModal}
              setShowDeleteEventModal={setShowDeleteEventModal}
              setEditedEvent={setEditedEvent}
            />
          </Route>
          <Route path={`${matchUrl}/Appearance`}>
            <>Appearance Component</>
          </Route>
          <Route path={matchUrl}>
            <VenueInfoComponent venue={currentVenue} roomIndex={roomIndex} />
          </Route>
        </Switch>
      </div>
      <AdminEventModal
        show={showCreateEventModal}
        onHide={adminEventModalOnHide}
        venueId={venueId}
        event={editedEvent}
        template={currentVenue.template}
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

export type VenueInfoComponentProps = {
  venue: WithId<AnyVenue>;
  roomIndex?: number;
  editedEvent?: WithId<VenueEvent>;
  setEditedEvent?: Function;
};

const VenueInfoComponent: React.FC<VenueInfoComponentProps> = ({
  venue,
  roomIndex,
}) => {
  const queryParams = useQuery();
  const manageUsers = !!queryParams.get("manageUsers");
  const { push } = useHistory();
  const onManageUsersModalHide = useCallback(() => push({ search: "" }), [
    push,
  ]);
  const placementDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clientWidth = placementDivRef.current?.clientWidth ?? 0;
    const clientHeight = placementDivRef.current?.clientHeight ?? 0;

    placementDivRef.current?.scrollTo(
      (venue.placement?.x ?? 0) - clientWidth / 2,
      (venue.placement?.y ?? 0) - clientHeight / 2
    );
  }, [venue]);

  const {
    isShown: isDeleteModalVisible,
    show: showDeleteModal,
    hide: hideDeleteModal,
  } = useShowHide();

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
                        venue.placement
                          ? {
                              icon: {
                                width: PLAYA_VENUE_SIZE,
                                height: PLAYA_VENUE_SIZE,
                                top: venue.placement.y,
                                left: venue.placement.x,
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
              Visit space
            </Link>
            <Link
              to={`/admin/venue/edit/${venue.id}`}
              className="btn btn-block"
            >
              Edit space
            </Link>
            <Link
              to={`/admin/venue/users-report/${venue.id}`}
              className="btn btn-block"
            >
              Users report
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

            <Link
              to={{ search: "manageUsers=true" }}
              className="btn btn-block btn-primary"
            >
              Manage Venue Owners
            </Link>
            {typeof roomIndex !== "number" && (
              <div className="page-container-adminpanel-actions__note">
                If you are looking to edit one of your rooms, please select the
                room in the left hand menu
              </div>
            )}
            {canBeDeleted(venue) && (
              <button
                role="link"
                className="btn btn-block btn-danger"
                onClick={showDeleteModal}
              >
                Delete space
              </button>
            )}
          </>
        )}
      </div>
      <VenueDeleteModal
        show={isDeleteModalVisible}
        onHide={hideDeleteModal}
        venue={venue}
      />
      <VenueOwnersModal
        visible={manageUsers}
        onHide={onManageUsersModalHide}
        venue={venue}
      />
    </>
  );
};

const Admin: React.FC = () => {
  const { user } = useUser();
  const userId = user?.uid || "";

  const { isAdminUser, isLoading: isAdminUserLoading } = useIsAdminUser(userId);

  // @debt refactor this + related code so as not to rely on using a shadowed 'storeAs' key
  //   this should be something like `storeAs: "venuesOwnedByUser"` or similar
  useFirestoreConnect({
    collection: "venues",
    where: [["owners", "array-contains", userId]],
    storeAs: "venues" as ValidStoreAsKeys, // @debt super hacky, but we're consciously subverting our helper protections
  });

  const venueId = useVenueId();
  const queryParams = useQuery();
  const queryRoomIndexString = queryParams.get("roomIndex");
  const queryRoomIndex = queryRoomIndexString
    ? parseInt(queryRoomIndexString)
    : undefined;

  if (isAdminUserLoading) return <>Loading...</>;
  if (!IS_BURN && !isAdminUser) return <>Forbidden</>;

  if (!user) {
    return <Redirect to={venueInsideUrl(DEFAULT_VENUE)} />;
  }

  return (
    <WithNavigationBar hasBackButton={false}>
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
