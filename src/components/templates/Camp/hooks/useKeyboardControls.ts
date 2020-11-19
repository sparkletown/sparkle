import { useCallback, useEffect, useState } from "react";
import { FirebaseReducer } from "react-redux-firebase";

import { CampRoomData } from "types/CampRoomData";
import { CampVenue } from "types/CampVenue";
import { orderedVenuesSelector } from "utils/selectors";
import { User } from "types/User";
import { Matrix, ReactHook } from "types/utility";

import { WithId } from "utils/id";
import { currentTimeInUnixEpoch } from "utils/time";
import { openRoomUrl } from "utils/url";
import { enterRoom } from "utils/useLocationUpdateEffect";

import { useSelector } from "hooks/useSelector";

import { DEFAULT_COLUMNS, DEFAULT_ROWS } from "../components/Map";

import { useKeyPress } from "./useKeyPress";

export const MOVEMENT_INTERVAL = 350;

interface UseKeyboardControlsProps {
  // From useUser() hook
  user?: FirebaseReducer.AuthState;
  profile?: FirebaseReducer.Profile<User>;

  // Passed down from Map component
  rows: number;
  columns: number;
  partygoersBySeat: Matrix<WithId<User>>;
  isHittingRoom: boolean;
  setIsHittingRoom: (value: boolean) => void;
  takeSeat: (row: number | null, column: number | null) => void;

  // Passed down from Camp component
  venue: CampVenue;
  selectedRoom?: CampRoomData;
  setSelectedRoom: (room: CampRoomData | undefined) => void;
}

interface KeyboardControls {
  roomEnter: (room: CampRoomData) => void;
}

export const useKeyboardControls: ReactHook<
  UseKeyboardControlsProps,
  KeyboardControls
> = ({
  user,
  profile,

  venue,
  partygoersBySeat,

  rows,
  columns,
  isHittingRoom,
  setIsHittingRoom,
  takeSeat,

  selectedRoom,
  setSelectedRoom,
}) => {
  const [keyDown, setKeyDown] = useState(false);

  const venues = useSelector(orderedVenuesSelector);

  const currentPosition = profile?.data?.[venue.id];

  const downPress = useKeyPress("ArrowDown");
  const upPress = useKeyPress("ArrowUp");
  const leftPress = useKeyPress("ArrowLeft");
  const rightPress = useKeyPress("ArrowRight");
  const enterPress = useKeyPress("Enter");

  const roomEnter = useCallback(
    (room: CampRoomData) => {
      const roomVenue = venues?.find((venue) =>
        room.url.endsWith(`/${venue.id}`)
      );
      const venueRoom = roomVenue
        ? { [roomVenue.name]: currentTimeInUnixEpoch }
        : {};
      room &&
        user &&
        enterRoom(
          user,
          {
            [`${venue.name}/${room.title}`]: currentTimeInUnixEpoch,
            ...venueRoom,
          },
          profile?.lastSeenIn
        );
    },
    [profile, user, venue, venues]
  );

  // TODO: this is duplicated logic from handlePotentialRoomClick in Map component, so we can probably simplify
  // TODO: do we want to filter this? Or just handle 1 room hit
  const hitRoom = useCallback(
    (row: number, column: number) => {
      let isHitting = false;
      venue.rooms.forEach((room: CampRoomData) => {
        const rowPosition = (100 / rows) * row;
        const colPosition = (100 / columns) * column;
        const roomX = Math.round(room.x_percent);
        const roomY = Math.round(room.y_percent);
        const roomWidth = Math.round(room.width_percent);
        const roomHeight = Math.round(room.height_percent);

        if (
          rowPosition >= roomY &&
          rowPosition <= roomY + roomHeight &&
          colPosition >= roomX &&
          colPosition <= roomX + roomWidth
        ) {
          setSelectedRoom(room);
          setIsHittingRoom(true);
          isHitting = true;
        } else {
          if (isHittingRoom && selectedRoom === room) {
            setSelectedRoom(undefined);
            setIsHittingRoom(false);
            isHitting = false;
          }
        }
      });
      return isHitting;
    },
    [
      columns,
      isHittingRoom,
      venue.rooms,
      rows,
      selectedRoom,
      setIsHittingRoom,
      setSelectedRoom,
    ]
  );

  useEffect(() => {
    if (!venue.id) return;

    if ((!currentPosition?.row && !currentPosition?.column) || keyDown) {
      return;
    }

    const { row, column } = currentPosition;
    if (row && column) {
      const seatTaken = (r: number, c: number) => partygoersBySeat?.[r]?.[c];
      if (enterPress && selectedRoom) {
        setKeyDown(true);
        setTimeout(() => setKeyDown(false), MOVEMENT_INTERVAL);
        openRoomUrl(selectedRoom.url);
        roomEnter(selectedRoom);
        return;
      }
      if (downPress) {
        setKeyDown(true);
        setTimeout(() => setKeyDown(false), MOVEMENT_INTERVAL);
        if (row + 1 > DEFAULT_ROWS || seatTaken(row + 1, column)) {
          return;
        }
        hitRoom(row + 1, column);
        takeSeat(row + 1, column);
        return;
      }
      if (upPress) {
        setKeyDown(true);
        setTimeout(() => setKeyDown(false), MOVEMENT_INTERVAL);
        if (row - 1 < 1 || seatTaken(row - 1, column)) {
          return;
        }
        hitRoom(row - 1, column);
        takeSeat(row - 1, column);
        return;
      }
      if (leftPress) {
        setKeyDown(true);
        setTimeout(() => setKeyDown(false), MOVEMENT_INTERVAL);
        if (column - 1 < 1 || seatTaken(row, column - 1)) {
          return;
        }
        hitRoom(row, column - 1);
        takeSeat(row, column - 1);
        return;
      }
      if (rightPress) {
        setKeyDown(true);
        setTimeout(() => setKeyDown(false), MOVEMENT_INTERVAL);
        if (column + 1 > DEFAULT_COLUMNS || seatTaken(row, column + 1)) {
          return;
        }
        hitRoom(row, column + 1);
        takeSeat(row, column + 1);
        return;
      }
    }
  }, [
    downPress,
    rightPress,
    leftPress,
    upPress,
    keyDown,
    venue.id,
    currentPosition,
    enterPress,
    selectedRoom,
    partygoersBySeat,
    roomEnter,
    hitRoom,
    takeSeat,
  ]);

  return {
    roomEnter,
  };
};
