import React, { useCallback, useEffect, useMemo, useState } from "react";
import firebase from "firebase/app";

import { User } from "types/User";
import { PartyMapVenue } from "types/PartyMapVenue";
import { PartyMapRoomData } from "types/PartyMapRoomData";

import { makeMatrixReducer } from "utils/reducers";
import { enterRoom } from "utils/useLocationUpdateEffect";
import { currentTimeInUnixEpoch } from "utils/time";
import { WithId } from "utils/id";
import { orderedVenuesSelector, partygoersSelector } from "utils/selectors";
import { openRoomUrl } from "utils/url";

import { useUser } from "hooks/useUser";
import { useSelector } from "hooks/useSelector";
import { useKeyboardControls } from "hooks/useKeyboardControls";

import Sidebar from "components/molecules/Sidebar";
import UserProfileModal from "components/organisms/UserProfileModal";
import { MapRow } from "components/molecules/MapRow";
import { MapPartygoerOverlay } from "components/molecules/MapPartygoerOverlay";
import { PartyMapRoomOverlay } from "./PartyMapRoomOverlay";

import "./Map.scss";
import { makeCampRoomHitFilter } from "utils/filter";
import { hasElements } from "utils/types";

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
  const venueId = venue.id;
  const { user, profile } = useUser();
  const [selectedUserProfile, setSelectedUserProfile] = useState<
    WithId<User>
  >();
  const [rows, setRows] = useState<number>(0);

  const columns = venue.columns ?? DEFAULT_COLUMNS;
  const currentPosition = profile?.data?.[venue.id];

  const columnsArray = useMemo(() => Array.from(Array<JSX.Element>(columns)), [
    columns,
  ]);
  const rowsArray = useMemo(() => Array.from(Array(rows)), [rows]);

  const venues = useSelector(orderedVenuesSelector);
  const partygoers = useSelector(partygoersSelector);

  useEffect(() => {
    const img = new Image();
    img.src = venue.mapBackgroundImageUrl ?? "";
    img.onload = () => {
      const imgRatio = img.width ? img.width / img.height : 1;
      const calcRows = venue.columns
        ? Math.round(parseInt(venue.columns.toString()) / imgRatio)
        : DEFAULT_ROWS;
      setRows(calcRows);
    };
  }, [venue.columns, venue.mapBackgroundImageUrl]);

  const roomsHit = useMemo(() => {
    if (!currentPosition?.row || !currentPosition?.column) return [];

    const { row, column } = currentPosition;

    const roomHitFilter = makeCampRoomHitFilter({
      row,
      column,
      totalRows: rows,
      totalColumns: columns,
    });

    return venue.rooms.filter(roomHitFilter);
  }, [currentPosition, rows, columns, venue.rooms]);

  const detectRoomsOnMove = useCallback(() => {
    if (selectedRoom) {
      const noRoomHits = hasElements(roomsHit);
      if (!noRoomHits && selectedRoom) {
        setSelectedRoom(undefined);
        setIsRoomModalOpen(false);
      }
    }

    roomsHit.forEach((room) => {
      setSelectedRoom(room);
      setIsRoomModalOpen(true);
    });
  }, [roomsHit, selectedRoom, setIsRoomModalOpen, setSelectedRoom]);

  const takeSeat = useCallback(
    (row: number | null, column: number | null) => {
      if (!user || !profile || !venueId) return;
      const doc = `users/${user.uid}`;
      const existingData = profile?.data;
      const update = {
        data: {
          ...existingData,
          [venueId]: {
            row,
            column,
          },
        },
      };
      const firestore = firebase.firestore();
      firestore
        .doc(doc)
        .update(update)
        .catch(() => {
          firestore.doc(doc).set(update);
        });
    },
    [profile, user, venueId]
  );

  const enterPartyMapRoom = useCallback(
    (room: PartyMapRoomData) => {
      if (!room || !user) return;

      // TODO: we could process this once to make it look uppable directly? What does the data key of venues look like?
      const roomVenue = venues?.find((venue) =>
        room.url.endsWith(`/${venue.id}`)
      );

      const roomName = {
        [`${venue.name}/${room.title}`]: currentTimeInUnixEpoch,
        ...(roomVenue ? { [venue.name]: currentTimeInUnixEpoch } : {}),
      };

      openRoomUrl(room.url);
      enterRoom(user, roomName, profile?.lastSeenIn);
    },
    [profile, user, venue.name, venues]
  );

  const partygoersBySeat = useMemo(() => {
    if (!venueId) return [];

    // TODO: this may be why we don't use row 0...? If so, let's change it to use types better and use undefines
    const selectRow = (partygoer: WithId<User>) =>
      partygoer?.data?.[venueId]?.row ?? 0;

    const selectCol = (partygoer: WithId<User>) =>
      partygoer?.data?.[venueId]?.column ?? 0;

    const partygoersReducer = makeMatrixReducer(selectRow, selectCol);

    return partygoers?.reduce(partygoersReducer, []);
  }, [venueId, partygoers]);

  const enterSelectedRoom = useCallback(() => {
    if (!selectedRoom) return;

    enterPartyMapRoom(selectedRoom);
  }, [enterPartyMapRoom, selectedRoom]);

  const isSeatTaken = useCallback(
    (r: number, c: number): boolean => !!partygoersBySeat?.[r]?.[c],
    [partygoersBySeat]
  );

  const onSeatClick = useCallback(
    (row: number, column: number, seatedPartygoer: WithId<User> | null) => {
      if (!seatedPartygoer) {
        takeSeat(row, column);
      }
    },
    [takeSeat]
  );

  useKeyboardControls({
    venueId,
    totalRows: rows,
    totalColumns: columns,
    isSeatTaken,
    takeSeat,
    enterSelectedRoom,
    onMove: detectRoomsOnMove,
  });

  const isUserProfileSelected: boolean = !!selectedUserProfile;

  const deselectUserProfile = useCallback(
    () => setSelectedUserProfile(undefined),
    []
  );

  const userUid = user?.uid;
  const showGrid = venue.showGrid;
  const mapGrid = useMemo(
    () =>
      showGrid ? (
        columnsArray.map((_, colIndex) => {
          return (
            <div className="seat-column" key={`column${colIndex}`}>
              {rowsArray.map((_, rowIndex) => {
                const column = colIndex + 1;
                const row = rowIndex + 1;

                const seatedPartygoer = partygoersBySeat?.[row]?.[column]
                  ? partygoersBySeat[row][column]
                  : null;

                const hasSeatedPartygoer = !!seatedPartygoer;

                const isMe = seatedPartygoer?.id === userUid;

                return (
                  <MapRow
                    key={`row${rowIndex}`}
                    row={row}
                    column={column}
                    showGrid={showGrid}
                    seatedPartygoer={seatedPartygoer}
                    hasSeatedPartygoer={hasSeatedPartygoer}
                    seatedPartygoerIsMe={isMe}
                    onSeatClick={onSeatClick}
                  />
                );
              })}
            </div>
          );
        })
      ) : (
        <div />
      ),
    [columnsArray, onSeatClick, partygoersBySeat, rowsArray, showGrid, userUid]
  );

  const partygoersOverlay = useMemo(
    () =>
      // @debt this can be undefined because our types are broken so check explicitly
      partygoers?.map(
        (partygoer) =>
          partygoer?.id && ( // @debt workaround, sometimes partygoers are duplicated but the new ones don't have id's
            <MapPartygoerOverlay
              key={partygoer.id}
              partygoer={partygoer}
              venueId={venue.id}
              myUserUid={userUid ?? ""} // @debt fix this to be less hacky
              totalRows={rows}
              totalColumns={columns}
              withMiniAvatars={venue.miniAvatars}
              setSelectedUserProfile={setSelectedUserProfile}
            />
          )
      ),
    [columns, partygoers, rows, userUid, venue.id, venue.miniAvatars]
  );

  const roomOverlay = useMemo(
    () =>
      venue.rooms.map((room) => (
        <PartyMapRoomOverlay
          key={room.title}
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
              gridTemplateColumns: `repeat(${columns}, calc(100% / ${columns}))`,
              gridTemplateRows: `repeat(${rows}, 1fr)`,
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
