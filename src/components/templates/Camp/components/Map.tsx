import React, { useCallback, useEffect, useMemo, useState } from "react";

import firebase from "firebase/app";

import { CampRoomData } from "types/CampRoomData";
import { CampVenue } from "types/CampVenue";
import { User } from "types/User";

import { WithId } from "utils/id";
import { makeMatrixReducer } from "utils/reducers";

import { useUser } from "hooks/useUser";

import { MapRoomsOverlay } from "./MapRoomsOverlay";
import { MapRow } from "./MapRow";

import { useKeyboardControls } from "../hooks/useKeyboardControls";

import { MapPartygoersOverlay } from "./MapPartygoersOverlay";

import "./Map.scss";

interface MapProps {
  venue: CampVenue;
  partygoers: WithId<User>[];
  attendances: { [location: string]: number };
  selectedRoom: CampRoomData | undefined;
  setSelectedRoom: (room: CampRoomData | undefined) => void;
  setIsRoomModalOpen: (value: boolean) => void;
}

export const DEFAULT_COLUMNS = 40;
export const DEFAULT_ROWS = 25;

export const Map: React.FC<MapProps> = ({
  venue,
  partygoers,
  attendances,
  selectedRoom,
  setSelectedRoom,
  setIsRoomModalOpen,
}) => {
  const { user, profile } = useUser();

  const venueId = venue.id;

  const columns = venue.columns ?? DEFAULT_COLUMNS;
  const [rows, setRows] = useState<number>(0);

  const templateColumns = venue.showGrid ? columns : DEFAULT_COLUMNS;
  const templateRows = venue.showGrid ? rows : DEFAULT_ROWS;

  const columnsArray = Array.from(Array<JSX.Element>(columns));
  const rowsArray = Array.from(Array(rows));

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

  const [isHittingRoom, setIsHittingRoom] = useState(false);

  const handlePotentialRoomClick = useCallback(
    (row: number, column: number) => {
      // TODO: this will run through all of the rooms, but the logic looks like we want to stop at the first
      //   if so, could use .find() instead?
      venue.rooms.forEach((room: CampRoomData) => {
        const rowPosition = (100 / rows) * row;
        const colPosition = (100 / columns) * column;
        const roomX = Math.trunc(room.x_percent);
        const roomY = Math.trunc(room.y_percent);
        const roomWidth = Math.trunc(room.width_percent);
        const roomHeight = Math.trunc(room.height_percent);

        if (
          rowPosition >= roomY &&
          rowPosition <= roomY + roomHeight &&
          colPosition >= roomX &&
          colPosition <= roomX + roomWidth
        ) {
          // TODO: move these out into their own useCallback'd blocks?
          setSelectedRoom(room);
          setIsHittingRoom(true);
          setIsRoomModalOpen(true);
        } else {
          if (isHittingRoom && selectedRoom) {
            setSelectedRoom(undefined);
            setIsHittingRoom(false);
          }
        }
      });
    },
    [
      isHittingRoom,
      venue.rooms,
      rows,
      columns,
      selectedRoom,
      setIsRoomModalOpen,
      setSelectedRoom,
    ]
  );

  // TODO: useCallback
  const onSeatClick = (
    row: number,
    column: number,
    seatedPartygoer: WithId<User> | null
  ) => {
    if (!seatedPartygoer) {
      takeSeat(row, column);
    } else {
      handlePotentialRoomClick(row, column);
    }
  };

  const partygoersBySeat = useMemo(() => {
    if (!venueId) return [];

    // TODO: this may be why we don't use row 0...? If so, let's change it to use types better and use undefines
    const selectRow = (partygoer: WithId<User>) =>
      partygoer?.data?.[venueId].row ?? 0;

    const selectCol = (partygoer: WithId<User>) =>
      partygoer?.data?.[venueId].row ?? 0;

    const partygoersReducer = makeMatrixReducer(selectRow, selectCol);

    return partygoers?.reduce(partygoersReducer, []);
  }, [venueId, partygoers]);

  // TODO: i think the logic in MapRoomsOverlay expects to be able to mutate this.. but maybe only locally to itself?
  // const rooms = venue.rooms;

  const { roomEnter } = useKeyboardControls({
    user,
    profile,

    rows,
    columns,
    partygoersBySeat,
    isHittingRoom,
    setIsHittingRoom,
    takeSeat,

    venue,

    selectedRoom,
    setSelectedRoom,
  });

  if (!user || !venue) {
    return <>Loading map...</>;
  }

  return (
    <div
      className="grid-container"
      style={{
        backgroundImage: `url(${venue.mapBackgroundImageUrl})`,
        backgroundSize: "cover",
        display: "grid",
        gridTemplateColumns: `repeat(${templateColumns}, calc(100% / ${templateColumns}))`,
        gridTemplateRows: `repeat(${templateRows}, 1fr)`,
      }}
    >
      {columnsArray.map((_, colIndex) => (
        <div className="seat-column" key={`column${colIndex}`}>
          {rowsArray.map((_, rowIndex) => {
            const column = colIndex + 1; // TODO: do these need to be here, can we zero index?
            const row = rowIndex + 1; // TODO: do these need to be here, can we zero index?

            const seatedPartygoer = partygoersBySeat?.[row]?.[column] ?? null;
            const hasSeatedPartygoer = !!seatedPartygoer;

            // TODO: our types imply that this shouldn't be able to be null, but it was..
            const isMe = seatedPartygoer?.id === user.uid;

            return (
              <MapRow
                key={`row${rowIndex}`}
                showGrid={venue.showGrid}
                hasSeatedPartygoer={hasSeatedPartygoer}
                seatedPartygoerIsMe={isMe}
                // TODO: make this a submodule + useCallback()?
                onSeatClick={() => onSeatClick(row, column, seatedPartygoer)}
              />
            );
          })}

          <MapPartygoersOverlay
            venueId={venue.id}
            myUserUid={user.uid}
            rows={rows}
            columns={columns}
            withMiniAvatars={venue.miniAvatars}
            partygoers={partygoers}
          />
        </div>
      ))}

      <MapRoomsOverlay
        venue={venue}
        // rooms={rooms}
        attendances={attendances}
        isHittingRoom={isHittingRoom}
        setSelectedRoom={setSelectedRoom}
        setIsRoomModalOpen={setIsRoomModalOpen}
        roomEnter={roomEnter}
      />
    </div>
  );
};
