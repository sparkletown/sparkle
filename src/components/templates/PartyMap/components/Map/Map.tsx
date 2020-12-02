import React, { useCallback, useEffect, useMemo, useState } from "react";
import firebase from "firebase/app";

import { User } from "types/User";
import { PartyMapVenue } from "types/PartyMapVenue";
import { PartyMapRoomData } from "types/RoomData";

import { currentTimeInUnixEpoch } from "utils/time";
import { trackRoomEntered } from "utils/useLocationUpdateEffect";
import { hasElements, isTruthy } from "utils/types";
import { makeCampRoomHitFilter } from "utils/filter";
import { openRoomUrl } from "utils/url";
import { orderedVenuesSelector } from "utils/selectors";
import { WithId } from "utils/id";

import { useUser } from "hooks/useUser";
import { useSelector } from "hooks/useSelector";
import { useKeyboardControls } from "hooks/useKeyboardControls";

// @debt refactor these hooks into somewhere more sensible
import { useMapGrid } from "components/templates/Camp/hooks/useMapGrid";
import { usePartygoersbySeat } from "components/templates/Camp/hooks/usePartygoersBySeat";
import { usePartygoersOverlay } from "components/templates/Camp/hooks/usePartygoersOverlay";

import UserProfileModal from "components/organisms/UserProfileModal";

import Sidebar from "components/molecules/Sidebar";

import { MapRoomOverlay } from "./MapRoomOverlay";

import "./Map.scss";

export const DEFAULT_COLUMNS = 40;
export const DEFAULT_ROWS = 25;

interface MapProps {
  venue: PartyMapVenue;
  partygoers: readonly WithId<User>[];
  selectedRoom: PartyMapRoomData | undefined;
  selectRoom: (room: PartyMapRoomData) => void;
  unselectRoom: () => void;
}

export const Map: React.FC<MapProps> = ({
  venue,
  partygoers,
  selectedRoom,
  selectRoom,
  unselectRoom,
}) => {
  const { user, profile } = useUser();

  const venueId = venue.id;

  const totalColumns = venue.columns ?? DEFAULT_COLUMNS;
  const [totalRows, setTotalRows] = useState<number>(0);

  // const templateColumns = venue.showGrid ? totalColumns : DEFAULT_COLUMNS;
  // const templateRows = venue.showGrid ? totalRows : DEFAULT_ROWS;

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

  // TODO: refactor this outside of the component itself?
  // TODO: use firestore from useFirestore hook rather than import
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

  // TODO: can we get rid of this in favour of just using roomsHit?
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
      //     unselectRoom() ?
      //     //setSelectedRoom(undefined);
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
    // TODO: we probably only want to call this once.. so could make it .find(), would only hit multiple if rooms overlap
    hasElements(roomsHit)
      ? roomsHit.forEach((room) => {
          selectRoom(room);
        })
      : unselectRoom();
  }, [roomsHit, selectRoom, unselectRoom]);

  // TODO: make this take WithId<User> | undefined instead of null?
  const onSeatClick = useCallback(
    (row: number, column: number, seatedPartygoer?: WithId<User>) => {
      if (!seatedPartygoer) {
        takeSeat(row, column);
      } else {
        // TODO: do we need to do this here? I think our roomsHit/useEffect logic might catch/handle it anyway?
        checkForRoomHit(row, column);
      }
    },
    [checkForRoomHit, takeSeat]
  );

  const { partygoersBySeat, isSeatTaken } = usePartygoersbySeat({
    venueId,
    partygoers: partygoers ?? [], // TODO: we shouldn't have to handle undefined here.. but this may be an issue with our types
  });

  const venues = useSelector(orderedVenuesSelector);
  const enterPartyMapRoom = useCallback(
    (room: PartyMapRoomData) => {
      if (!room || !user) return;

      // TODO: we could process this once to make it look uppable directly? What does the data key of venues look like?
      const roomVenue = venues?.find((venue) =>
        room.url.endsWith(`/${venue.id}`)
      );

      // TODO: note that currentTimeInUnixEpoch is a const set once when app loads, not the actual current time. Is that correct?
      const roomName = {
        [`${venue.name}/${room.title}`]: currentTimeInUnixEpoch,
        ...(roomVenue ? { [venue.name]: currentTimeInUnixEpoch } : {}),
      };

      trackRoomEntered(user, roomName, profile?.lastSeenIn);

      // TODO: this is how it was here before I merged Camp's Map. Which is correct?
      openRoomUrl(room.url);
    },
    [profile, user, venue, venues]
  );

  // TODO: can we move this into PartyMap or similar?
  const enterSelectedRoom = useCallback(() => {
    if (!selectedRoom) return;

    enterPartyMapRoom(selectedRoom);
  }, [enterPartyMapRoom, selectedRoom]);

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

  // TODO: do we want a 'selectUserProfile' here?

  const deselectUserProfile = useCallback(
    () => setSelectedUserProfile(undefined),
    []
  );

  const isUserProfileSelected = isTruthy(selectedUserProfile);

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

  // TODO: this probably doesn't even need to be a hook.. it's more of a component if anything. We can clean this up later
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
          isSelected={room === selectedRoom}
          selectRoom={() => selectRoom(room)}
        />
      )),
    [selectRoom, selectedRoom, venue]
  );

  if (!user || !venue) {
    return <>Loading map...</>;
  }

  // TODO: this was the old way we were adding the map background, now we're using img below. Is that what we want?
  // <div
  //     className="camp-grid-container"
  //     style={{
  //       backgroundImage: `url(${venue.mapBackgroundImageUrl})`,
  //       backgroundSize: "cover",
  //       display: "grid",
  //       gridTemplateColumns: `repeat(${templateColumns}, calc(100% / ${templateColumns}))`,
  //       gridTemplateRows: `repeat(${templateRows}, 1fr)`,
  //     }}
  // >

  return (
    <div className="party-map-content-container">
      <div className="party-map-container">
        <div className="party-map-content">
          {/* TODO: do we want to use img here? see above code snippet from the old Camp Map template */}
          <img
            width="100%"
            className="party-map-background"
            src={venue.mapBackgroundImageUrl}
            alt=""
          />

          {/* TODO: this wrapping div wasn't present in the Camp Map component. How does it change what we're doing in mapGrid? */}
          <div
            className="party-map-grid-container"
            // TODO: extract this into a memo'd const so it doesn't cause re-renders
            style={{
              gridTemplateColumns: `repeat(${totalColumns}, calc(100% / ${totalColumns}))`,
              gridTemplateRows: `repeat(${totalRows}, 1fr)`,
            }}
          >
            {mapGrid}
            {partygoersOverlay}
            {roomOverlay}
          </div>

          {isUserProfileSelected && (
            <UserProfileModal
              onHide={deselectUserProfile}
              show={isUserProfileSelected} // TODO: do we need this param here if we're checking it before rendering anyway?
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
