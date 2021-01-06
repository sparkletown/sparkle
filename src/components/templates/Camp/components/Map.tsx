import React, { useCallback, useEffect, useMemo, useState } from "react";

import firebase from "firebase/app";

import { Attendances } from "types/Attendances";
import { CampRoomData } from "types/CampRoomData";
import { CampVenue } from "types/CampVenue";
import { User } from "types/User";

import { makeCampRoomHitFilter } from "utils/filter";
import { WithId } from "utils/id";
import { orderedVenuesSelector } from "utils/selectors";
import { getCurrentTimeInUnixEpochSeconds } from "utils/time";
import { enterLocation } from "utils/useLocationUpdateEffect";

import { useSelector } from "hooks/useSelector";
import { useUser } from "hooks/useUser";
import { useKeyboardControls } from "hooks/useKeyboardControls";

import UserProfileModal from "components/organisms/UserProfileModal";

import { useMapGrid } from "../hooks/useMapGrid";
import { usePartygoersbySeat } from "../hooks/usePartygoersBySeat";
import { usePartygoersOverlay } from "../hooks/usePartygoersOverlay";

import { MapRoomOverlay } from "./MapRoomOverlay";

import "./Map.scss";

interface MapProps {
  venue: CampVenue;
  partygoers: readonly WithId<User>[];
  attendances: Attendances;
  selectedRoom: CampRoomData | undefined;
  selectRoom: (room: CampRoomData) => void;
}

export const DEFAULT_COLUMNS = 40;
export const DEFAULT_ROWS = 25;

export const Map: React.FC<MapProps> = ({
  venue,
  partygoers,
  attendances,
  selectedRoom,
  selectRoom,
}) => {
  const { user, profile } = useUser();

  const venueId = venue.id;

  const totalColumns = venue.columns ?? DEFAULT_COLUMNS;
  const [totalRows, setTotalRows] = useState<number>(0);

  const templateColumns = venue.showGrid ? totalColumns : DEFAULT_COLUMNS;
  const templateRows = venue.showGrid ? totalRows : DEFAULT_ROWS;

  const columnsArray = useMemo(
    () => Array.from(Array<JSX.Element>(totalColumns)),
    [totalColumns]
  );
  const rowsArray = useMemo(() => Array.from(Array(totalRows)), [totalRows]);

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
        selectRoom(room);
      });

      // TODO: MISS
      //   if (selectedRoom) {
      //     setSelectedRoom(undefined);
      //   }
    },
    [selectRoom, totalColumns, totalRows, venue.rooms]
  );

  const roomsHit = useMemo(() => {
    if (!currentPosition?.row || !currentPosition?.column) return [];

    const { row, column } = currentPosition;

    //TODO: Move filter ouside and change name to something generic
    const roomHitFilter = makeCampRoomHitFilter({
      row,
      column,
      totalRows,
      totalColumns,
    });

    return venue.rooms.filter(roomHitFilter);
  }, [currentPosition, totalRows, totalColumns, venue.rooms]);

  useEffect(() => {
    roomsHit.forEach((room) => {
      selectRoom(room);
    });

    // TODO: NOT HIT
    // if (selectedRoom === room) {
    //   setSelectedRoom(undefined); // this comes from camp
    // }
  }, [roomsHit, selectRoom]);

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

  const { partygoersBySeat, isSeatTaken } = usePartygoersbySeat({
    venueId,
    partygoers,
  });

  const venues = useSelector(orderedVenuesSelector);

  // @debt refactor this to use openRoomWithCounting (though this is getting deleted soon so might not matter)
  const enterCampRoom = useCallback(
    (room: CampRoomData) => {
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

      enterLocation(user, roomName, profile?.lastSeenIn);
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
    totalRows,
    totalColumns,
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

  const userUid = user?.uid;
  const showGrid = venue.showGrid;

  const mapGrid = useMapGrid({
    showGrid,
    userUid,
    columnsArray,
    rowsArray,
    partygoersBySeat,
    onSeatClick,
  });

  const partygoersOverlay = usePartygoersOverlay({
    showGrid,
    userUid,
    venueId,
    withMiniAvatars: venue.miniAvatars,
    rows: totalRows,
    columns: totalColumns,
    partygoers,
    setSelectedUserProfile,
  });

  const roomOverlay = useMemo(
    () =>
      venue.rooms.map((room) => (
        <MapRoomOverlay
          // TODO: is room.title unique? Is there something better we can use for the key?
          key={room.title}
          venue={venue}
          room={room}
          attendances={attendances}
          enterCampRoom={enterCampRoom}
          selectRoom={selectRoom}
        />
      )),
    [attendances, enterCampRoom, selectRoom, venue]
  );

  if (!user || !venue) {
    return <>Loading map...</>;
  }

  return (
    <div
      className="camp-grid-container"
      style={{
        backgroundImage: `url(${venue.mapBackgroundImageUrl})`,
        backgroundSize: "cover",
        display: "grid",
        gridTemplateColumns: `repeat(${templateColumns}, calc(100% / ${templateColumns}))`,
        gridTemplateRows: `repeat(${templateRows}, 1fr)`,
      }}
    >
      {mapGrid}
      {partygoersOverlay}
      {roomOverlay}

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
