import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useFirestore } from "react-redux-firebase";

import { User } from "types/User";
import { PartyMapVenue } from "types/PartyMapVenue";
import { PartyMapRoomData } from "types/PartyMapRoomData";

import { enterLocation } from "utils/useLocationUpdateEffect";
import { getCurrentTimeInUnixEpochSeconds } from "utils/time";
import { WithId } from "utils/id";
import { orderedVenuesSelector } from "utils/selectors";
import { openRoomUrl } from "utils/url";

import { useUser } from "hooks/useUser";
import { useSelector } from "hooks/useSelector";
import { useKeyboardControls } from "hooks/useKeyboardControls";
import { useVenueUsers } from "hooks/useUsers";

import Sidebar from "components/molecules/Sidebar";
import UserProfileModal from "components/organisms/UserProfileModal";
import { PartyMapRoomOverlay } from "./PartyMapRoomOverlay";

import "./Map.scss";
import { makeCampRoomHitFilter } from "utils/filter";
import { hasElements } from "utils/types";

// @debt refactor these hooks into somewhere more sensible
import { useMapGrid } from "../../../Camp/hooks/useMapGrid";
import { usePartygoersOverlay } from "../../../Camp/hooks/usePartygoersOverlay";
import { usePartygoersbySeat } from "../../../Camp/hooks/usePartygoersBySeat";

interface PropsType {
  venue: PartyMapVenue;
  attendances: { [location: string]: number };
  selectedRoom: PartyMapRoomData | undefined;
  setSelectedRoom: (room: PartyMapRoomData | undefined) => void;
  setIsRoomModalOpen: (value: boolean) => void;
}

const DEFAULT_COLUMNS = 40;
const DEFAULT_ROWS = 25;

export const Map: React.FC<PropsType> = ({
  venue,
  attendances,
  selectedRoom,
  setSelectedRoom,
  setIsRoomModalOpen,
}) => {
  const firestore = useFirestore();

  const [selectedUserProfile, setSelectedUserProfile] = useState<
    WithId<User>
  >();

  const { user, profile } = useUser();
  const partygoers = useVenueUsers();
  const venues = useSelector(orderedVenuesSelector);

  const userUid = user?.uid;
  const venueId = venue.id;
  const showGrid = venue.showGrid;
  const isUserProfileSelected = !!selectedUserProfile;

  const currentPosition = profile?.data?.[venue.id];

  const columnsArray = useMemo(
    () => Array.from(Array(venue.columns ?? DEFAULT_COLUMNS)),
    [venue.columns]
  );
  const [rowsArray, setRowsArray] = useState(Array.from(Array(DEFAULT_ROWS)));

  const { partygoersBySeat, isSeatTaken } = usePartygoersbySeat({
    venueId,
    partygoers,
  });

  const partygoersOverlay = usePartygoersOverlay({
    showGrid,
    userUid,
    venueId,
    withMiniAvatars: venue.miniAvatars,
    rows: rowsArray.length,
    columns: columnsArray.length,
    partygoers,
    setSelectedUserProfile,
  });

  useEffect(() => {
    const img = new Image();
    img.src = venue.mapBackgroundImageUrl ?? "";
    img.onload = () => {
      const imgRatio = img.width ? img.width / img.height : 1;
      const calcRows = venue.columns
        ? Math.round(parseInt(venue.columns.toString()) / imgRatio)
        : DEFAULT_ROWS;
      setRowsArray(Array.from(Array(calcRows)));
    };
  }, [venue.columns, venue.mapBackgroundImageUrl]);

  const prevSeat = useRef<{
    row: number | null;
    column: number | null;
  }>();

  const takeSeat = useCallback(
    async (row: number | null, column: number | null) => {
      if (!userUid || !venueId) return;

      if (
        prevSeat.current?.column === column &&
        prevSeat.current?.row === row
      ) {
        return;
      }
      prevSeat.current = { row, column };

      const doc = `users/${userUid}`;
      // FIXME: @debt This way it will rewrite all other locations.
      // But if you turn it on, the performance will drop drastically,
      // because profile will be updated on every function call

      // const existingData = profile?.data;
      const update = {
        data: {
          // ...existingData,
          [venueId]: {
            row,
            column,
          },
        },
      };

      await firestore
        .doc(doc)
        .update(update)
        .catch(() => {
          firestore.doc(doc).set(update);
        });
    },
    [firestore, userUid, venueId]
  );

  const onSeatClick = useMemo(
    () => (
      row: number,
      column: number,
      seatedPartygoer: WithId<User> | null
    ) => {
      if (!seatedPartygoer) {
        takeSeat(row, column);
      }
    },
    [takeSeat]
  );

  const deselectUserProfile = useCallback(
    () => setSelectedUserProfile(undefined),
    []
  );

  const mapGrid = useMapGrid({
    showGrid,
    userUid,
    columnsArray,
    rowsArray,
    partygoersBySeat,
    onSeatClick,
  });

  // TODO: @debt refactor this to use openRoomWithCounting
  const enterPartyMapRoom = useCallback(
    (room: PartyMapRoomData) => {
      if (!room || !user) return;

      // TODO: we could process this once to make it look uppable directly? What does the data key of venues look like?
      const roomVenue = venues?.find((venue) =>
        room.url.endsWith(`/${venue.id}`)
      );

      const nowInEpochSeconds = getCurrentTimeInUnixEpochSeconds();

      const roomName = {
        [`${venue.name}/${room.title}`]: nowInEpochSeconds,
        ...(roomVenue ? { [venue.name]: nowInEpochSeconds } : {}),
      };

      openRoomUrl(room.url);
      enterLocation(user, roomName, profile?.lastSeenIn);
    },
    [profile, user, venue.name, venues]
  );

  const enterSelectedRoom = useCallback(() => {
    if (!selectedRoom) return;

    enterPartyMapRoom(selectedRoom);
  }, [enterPartyMapRoom, selectedRoom]);

  const roomsHit = useMemo(() => {
    if (!currentPosition?.row || !currentPosition?.column) return [];

    const { row, column } = currentPosition;

    const roomHitFilter = makeCampRoomHitFilter({
      row,
      column,
      totalRows: rowsArray.length,
      totalColumns: columnsArray.length,
    });

    return venue.rooms?.filter(roomHitFilter);
  }, [currentPosition, rowsArray.length, columnsArray.length, venue.rooms]);

  const detectRoomsOnMove = useCallback(() => {
    if (selectedRoom) {
      const noRoomHits = hasElements(roomsHit);
      if (!noRoomHits && selectedRoom) {
        setSelectedRoom(undefined);
        setIsRoomModalOpen(false);
      }
    }

    roomsHit?.forEach((room) => {
      setSelectedRoom(room);
      setIsRoomModalOpen(true);
    });
  }, [roomsHit, selectedRoom, setIsRoomModalOpen, setSelectedRoom]);

  useKeyboardControls({
    venueId,
    totalRows: rowsArray.length,
    totalColumns: columnsArray.length,
    isSeatTaken,
    takeSeat,
    enterSelectedRoom,
    onMove: detectRoomsOnMove,
  });

  const roomOverlay = useMemo(
    () =>
      venue.rooms?.map((room, index) => (
        <PartyMapRoomOverlay
          key={`${room.title} ${index}`}
          venue={venue}
          room={room}
          attendances={attendances}
          setSelectedRoom={setSelectedRoom}
          setIsRoomModalOpen={setIsRoomModalOpen}
          // onEnterRoom={enterPartyMapRoom}
        />
      )),
    [attendances, setIsRoomModalOpen, setSelectedRoom, venue]
  );

  if (!user || !venue) {
    return <>Loading map...</>;
  }

  return (
    <div className="party-map-content-container">
      <div className="party-map-container">
        <div className="party-map-content">
          <img
            width="100%"
            className="party-map-background"
            src={venue.mapBackgroundImageUrl}
            alt=""
          />

          <div
            className="party-map-grid-container"
            style={{
              gridTemplateColumns: `repeat(${columnsArray.length}, calc(100% / ${columnsArray.length}))`,
              gridTemplateRows: `repeat(${rowsArray.length}, 1fr)`,
            }}
          >
            {mapGrid}
            {partygoersOverlay}
            {roomOverlay}
          </div>

          {selectedUserProfile && (
            <UserProfileModal
              show={isUserProfileSelected}
              onHide={deselectUserProfile}
              userProfile={selectedUserProfile}
            />
          )}
        </div>
      </div>

      <div className="sidebar">
        <Sidebar />
      </div>
    </div>
  );
};
