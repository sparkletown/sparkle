import React, { useCallback, useEffect, useMemo, useState } from "react";

import firebase from "firebase/app";

import { Attendances } from "types/Attendances";
import { CampRoomData } from "types/CampRoomData";
import { CampVenue } from "types/CampVenue";
import { User } from "types/User";

import { makeCampRoomHitFilter } from "utils/filter";
import { WithId } from "utils/id";
import { makeMatrixReducer } from "utils/reducers";
import { orderedVenuesSelector } from "utils/selectors";
import { currentTimeInUnixEpoch } from "utils/time";
import { enterRoom } from "utils/useLocationUpdateEffect";

import { useSelector } from "hooks/useSelector";
import { useUser } from "hooks/useUser";

import UserProfileModal from "components/organisms/UserProfileModal";

import { useKeyboardControls } from "../hooks/useKeyboardControls";

import { MapRoomOverlay } from "./MapRoomOverlay";
import { MapPartygoerOverlay } from "./MapPartygoerOverlay";
import { MapRow } from "./MapRow";

import "./Map.scss";

interface MapProps {
  venue: CampVenue;
  partygoers: readonly WithId<User>[];
  attendances: Attendances;
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

  const totalColumns = venue.columns ?? DEFAULT_COLUMNS;
  const [totalRows, setTotalRows] = useState<number>(0);

  const templateColumns = venue.showGrid ? totalColumns : DEFAULT_COLUMNS;
  const templateRows = venue.showGrid ? totalRows : DEFAULT_ROWS;

  const columnsArray = Array.from(Array<JSX.Element>(totalColumns));
  const rowsArray = Array.from(Array(totalRows));

  useEffect(() => {
    const img = new Image();
    img.src = venue.mapBackgroundImageUrl ?? "";
    img.onload = () => {
      const imgRatio = img.width ? img.width / img.height : 1;
      const calcRows = venue.columns
        ? Math.round(parseInt(venue.columns.toString()) / imgRatio)
        : DEFAULT_ROWS;
      setTotalRows(calcRows);
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

  const currentPosition = profile?.data?.[venue.id];

  const checkForRoomHit = useCallback(
    (row: number, column: number) => {
      const roomHitFilter = makeCampRoomHitFilter({
        row,
        column,
        totalRows,
        totalColumns: totalColumns,
      });

      // TODO: this will run through all of the rooms, but the logic looks like we want to stop at the first
      //   if so, could use .find() instead?
      venue.rooms.filter(roomHitFilter).forEach((room) => {
        setSelectedRoom(room);
        setIsRoomModalOpen(true);
      });

      // TODO: MISS
      //   if (selectedRoom) {
      //     setSelectedRoom(undefined);
      //   }
    },
    [venue.rooms, totalRows, totalColumns, setIsRoomModalOpen, setSelectedRoom]
  );

  const roomsHit = useMemo(() => {
    if (!currentPosition?.row || !currentPosition?.column) return [];

    const { row, column } = currentPosition;

    const roomHitFilter = makeCampRoomHitFilter({
      row,
      column,
      totalRows,
      totalColumns: totalColumns,
    });

    return venue.rooms.filter(roomHitFilter);
  }, [currentPosition, totalRows, totalColumns, venue.rooms]);

  useEffect(() => {
    roomsHit.forEach((room) => {
      setSelectedRoom(room);
      // setIsRoomModalOpen(true); // TODO: do we need this here as well?
    });

    // TODO: NOT HIT
    // if (selectedRoom === room) {
    //   setSelectedRoom(undefined); // this comes from camp
    // }
  }, [roomsHit, setSelectedRoom]);

  // TODO: useCallback
  const onSeatClick = (
    row: number,
    column: number,
    seatedPartygoer: WithId<User> | null
  ) => {
    if (!seatedPartygoer) {
      takeSeat(row, column);
    } else {
      checkForRoomHit(row, column);
    }
  };

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

  const isSeatTaken = useCallback(
    (r: number, c: number): boolean => !!partygoersBySeat?.[r]?.[c],
    [partygoersBySeat]
  );

  const venues = useSelector(orderedVenuesSelector);
  const enterCampRoom = useCallback(
    (room: CampRoomData) => {
      if (!room || !user) return;

      // TODO: we could process this once to make it look uppable directly? What does the data key of venues look like?
      const roomVenue = venues?.find((venue) =>
        room.url.endsWith(`/${venue.id}`)
      );

      const roomName = {
        [`${venue.name}/${room.title}`]: currentTimeInUnixEpoch,
        ...(roomVenue ? { [venue.name]: currentTimeInUnixEpoch } : {}),
      };

      enterRoom(user, roomName, profile?.lastSeenIn);
    },
    [profile, user, venue, venues]
  );

  // TODO: can we move this into Camp or similar?
  const enterSelectedRoom = useCallback(() => {
    if (!selectedRoom) return;

    enterCampRoom(selectedRoom);
  }, [enterCampRoom, selectedRoom]);

  useKeyboardControls({
    venueId,
    totalRows: totalRows,
    totalColumns: totalColumns,
    isSeatTaken,
    takeSeat,
    enterSelectedRoom,
  });

  const [selectedUserProfile, setSelectedUserProfile] = useState<
    WithId<User>
  >();

  const isUserProfileSelected: boolean = !!selectedUserProfile;

  const deselectUserProfile = useCallback(
    () => setSelectedUserProfile(undefined),
    []
  );

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
                // TODO: useCallback()?
                onSeatClick={() => onSeatClick(row, column, seatedPartygoer)}
              />
            );
          })}

          {partygoers.map((partygoer, index) => (
            <MapPartygoerOverlay
              key={partygoer.id}
              partygoer={partygoer}
              venueId={venue.id}
              myUserUid={user.uid}
              totalRows={totalRows}
              totalColumns={totalColumns}
              withMiniAvatars={venue.miniAvatars}
              setSelectedUserProfile={setSelectedUserProfile}
            />
          ))}
        </div>
      ))}

      {venue.rooms.map((room) => (
        <MapRoomOverlay
          // TODO: is room.title unique? Is there something better we can use for the key?
          key={room.title}
          venue={venue}
          room={room}
          attendances={attendances}
          setSelectedRoom={setSelectedRoom}
          setIsRoomModalOpen={setIsRoomModalOpen}
          enterCampRoom={enterCampRoom}
        />
      ))}

      {selectedUserProfile && (
        <UserProfileModal
          show={isUserProfileSelected}
          userProfile={selectedUserProfile}
          onHide={deselectUserProfile}
        />
      )}
    </div>
  );
};
