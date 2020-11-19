import React, { useCallback, useEffect, useState } from "react";

import { IS_BURN } from "secrets";

import { retainAttendance } from "store/actions/Attendance";

import firebase from "firebase/app";

import { orderedVenuesSelector } from "utils/selectors";

import { CampRoomData } from "types/CampRoomData";
import { CampVenue } from "types/CampVenue";
import { User } from "types/User";
import { RoomVisibility } from "types/Venue";

import { WithId } from "utils/id";
import { currentTimeInUnixEpoch } from "utils/time";
import { getRoomUrl, isExternalUrl, openRoomUrl } from "utils/url";
import { enterRoom } from "utils/useLocationUpdateEffect";

import { useUser } from "hooks/useUser";
import { useDispatch } from "hooks/useDispatch";
import { useSelector } from "hooks/useSelector";
import { useVenueId } from "hooks/useVenueId";

import UserProfileModal from "components/organisms/UserProfileModal";

import UserProfilePicture from "components/molecules/UserProfilePicture";

import CampAttendance from "./CampAttendance";

import "./Map.scss";

interface MapProps {
  venue: CampVenue;
  partygoers: WithId<User>[];
  attendances: { [location: string]: number };
  selectedRoom: CampRoomData | undefined;
  setSelectedRoom: (room: CampRoomData | undefined) => void;
  setIsRoomModalOpen: (value: boolean) => void;
}

const DEFAULT_COLUMNS = 40;
const DEFAULT_ROWS = 25;
const MOVEMENT_INTERVAL = 350;

export const Map: React.FC<MapProps> = ({
  venue,
  partygoers,
  attendances,
  selectedRoom,
  setSelectedRoom,
  setIsRoomModalOpen,
}) => {
  const venueId = useVenueId();
  const { user, profile } = useUser();
  const dispatch = useDispatch();
  const [roomClicked, setRoomClicked] = useState<string | undefined>(undefined);
  const [roomHovered, setRoomHovered] = useState<CampRoomData | undefined>(
    undefined
  );
  const [selectedUserProfile, setSelectedUserProfile] = useState<
    WithId<User>
  >();
  const [keyDown, setKeyDown] = useState(false);
  const [isHittingRoom, setIsHittingRoom] = useState(false);
  const [rows, setRows] = useState<number>(0);

  const venues = useSelector(orderedVenuesSelector);

  const columns = venue.columns ?? DEFAULT_COLUMNS;
  const rooms = [...venue.rooms];
  const currentPosition = profile?.data?.[venue.id];

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

  const useKeyPress = function (targetKey: string) {
    const [keyPressed, setKeyPressed] = useState(false);

    function downHandler({ key }: { key: string }) {
      if (key === targetKey) {
        setKeyPressed(true);
        setTimeout(() => setKeyPressed(false), MOVEMENT_INTERVAL);
      }
    }

    const upHandler = ({ key }: { key: string }) => {
      if (key === targetKey) {
        setKeyPressed(false);
      }
    };

    useEffect(() => {
      window.addEventListener("keydown", (e: KeyboardEvent) => {
        if (
          ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.key) >
          -1
        ) {
          e.preventDefault();
        }
        downHandler(e);
      });
      window.addEventListener("keyup", upHandler);

      return () => {
        window.removeEventListener("keydown", downHandler);
        window.removeEventListener("keyup", upHandler);
      };
    });

    return keyPressed;
  };

  const downPress = useKeyPress("ArrowDown");
  const upPress = useKeyPress("ArrowUp");
  const leftPress = useKeyPress("ArrowLeft");
  const rightPress = useKeyPress("ArrowRight");
  const enterPress = useKeyPress("Enter");

  const hitRoom = useCallback(
    (r: number, c: number) => {
      let isHitting = false;
      rooms.forEach((room: CampRoomData) => {
        const rowPosition = (100 / rows) * r;
        const colPosition = (100 / columns) * c;
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
    [columns, isHittingRoom, rooms, rows, selectedRoom, setSelectedRoom]
  );

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

  const partygoersBySeat: WithId<User>[][] = [];
  partygoers &&
    partygoers.forEach((partygoer) => {
      if (
        !venueId ||
        !partygoer?.id ||
        !partygoer?.data ||
        partygoer.data[venueId] === undefined ||
        partygoer.data[venueId].row === undefined ||
        partygoer.data[venueId].column === undefined
      )
        return;
      const row = partygoer.data[venueId].row || 0;
      const column = partygoer.data[venueId].column || 0;
      if (!(row in partygoersBySeat)) {
        partygoersBySeat[row] = [];
      }
      partygoersBySeat[row][column] = partygoer;
    });

  useEffect(() => {
    if (!venueId) return;

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
    venueId,
    currentPosition,
    enterPress,
    selectedRoom,
    partygoersBySeat,
    roomEnter,
    hitRoom,
    takeSeat,
  ]);

  if (!venue) {
    return <>Loading map...</>;
  }

  if (roomHovered) {
    const idx = rooms.findIndex((room) => room.title === roomHovered.title);
    if (idx !== -1) {
      const chosenRoom = rooms.splice(idx, 1);
      rooms.push(chosenRoom[0]);
    }
  }

  const openModal = (room: CampRoomData) => {
    setSelectedRoom(room);
    setIsRoomModalOpen(true);
  };

  const onSeatClick = (
    row: number,
    column: number,
    seatedPartygoer: WithId<User> | null
  ) => {
    if (!seatedPartygoer) {
      takeSeat(row, column);
    }
    rooms.forEach((room: CampRoomData) => {
      const rowPosition = (100 / rows) * row;
      const colPosition = (100 / columns) * column;
      const roomX = Math.trunc(room.x_percent);
      const roomY = Math.trunc(room.y_percent);
      const roomWidth = Math.trunc(room.width_percent);
      const roomHeight = Math.trunc(room.height_percent);

      if (
        !seatedPartygoer &&
        rowPosition >= roomY &&
        rowPosition <= roomY + roomHeight &&
        colPosition >= roomX &&
        colPosition <= roomX + roomWidth
      ) {
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
  };

  const onJoinRoom = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    room: CampRoomData
  ) => {
    e.stopPropagation();
    if (isExternalUrl(room.url)) {
      openRoomUrl(room.url);
    } else {
      window.location.href = getRoomUrl(room.url);
    }
    roomEnter(room);
  };

  const templateColumns = venue.showGrid ? columns : DEFAULT_COLUMNS;
  const templateRows = venue.showGrid ? rows : DEFAULT_ROWS;

  return (
    <>
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
        {venue.showGrid && rows ? (
          Array.from(Array(columns)).map((_, colIndex) => {
            return (
              <div className="seat-column" key={`column${colIndex}`}>
                {Array.from(Array(rows)).map((_, rowIndex) => {
                  const column = colIndex + 1;
                  const row = rowIndex + 1;
                  const seatedPartygoer = partygoersBySeat?.[row]?.[column]
                    ? partygoersBySeat[row][column]
                    : null;
                  const isMe = seatedPartygoer?.id === user?.uid;
                  return (
                    <div key={`row${rowIndex}`} className={`seat-row`}>
                      {venue.showGrid && (
                        <div
                          className={"seat-container"}
                          onClick={() =>
                            onSeatClick(row, column, seatedPartygoer)
                          }
                        >
                          <div
                            className={seatedPartygoer ? "seat" : `not-seat`}
                            key={`row${rowIndex}`}
                          >
                            {seatedPartygoer && (
                              <div className={isMe ? "user avatar" : "user"} />
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
                {venue.showGrid &&
                  rows &&
                  partygoers.map((partygoer, index) => {
                    const isMe = partygoer.id === user?.uid;
                    const position = partygoer?.data?.[venue.id];
                    const currentRow = position?.row ?? 0;
                    const currentCol = position?.column ?? 0;
                    const avatarWidth = 100 / columns;
                    const avatarHeight = 100 / rows;
                    return (
                      !!partygoer.id && (
                        <UserProfilePicture
                          key={`partygoer-${index}`}
                          user={partygoer}
                          containerStyle={{
                            display: "flex",
                            width: `${avatarWidth}%`,
                            height: `${avatarHeight}%`,
                            position: "absolute",
                            cursor: "pointer",
                            transition:
                              "all 1400ms cubic-bezier(0.23, 1 ,0.32, 1)",
                            top: `${avatarHeight * (currentRow - 1)}%`,
                            left: `${avatarWidth * (currentCol - 1)}%`,
                            justifyContent: "center",
                          }}
                          avatarStyle={{
                            width: "80%",
                            height: "80%",
                            borderRadius: "100%",
                            alignSelf: "center",
                            backgroundImage: `url(${partygoer?.pictureUrl})`,
                            backgroundSize: "cover",
                          }}
                          avatarClassName={`${
                            isMe ? "me profile-avatar" : "profile-avatar"
                          }`}
                          setSelectedUserProfile={setSelectedUserProfile}
                          miniAvatars={venue?.miniAvatars}
                        />
                      )
                    );
                  })}
              </div>
            );
          })
        ) : (
          <div />
        )}
        {!!rooms.length &&
          rooms.map((room) => {
            const left = room.x_percent;
            const top = room.y_percent;
            const width = room.width_percent;
            const height = room.height_percent;
            const isUnderneathRoom = isHittingRoom && room === selectedRoom;
            const hasAttendance = attendances[`${venue.name}/${room.title}`];
            return (
              <div
                className={`room position-absolute ${
                  isUnderneathRoom && "isUnderneath"
                }`}
                style={{
                  left: left + "%",
                  top: top + "%",
                  width: width + "%",
                  height: height + "%",
                }}
                key={room.title}
                onClick={() => {
                  if (!IS_BURN) {
                    openModal(room);
                  } else {
                    setRoomClicked((prevRoomClicked) =>
                      prevRoomClicked === room.title ? undefined : room.title
                    );
                  }
                }}
                onMouseEnter={() => {
                  dispatch(retainAttendance(true));
                  setRoomHovered(room);
                }}
                onMouseLeave={() => {
                  dispatch(retainAttendance(false));
                  setRoomHovered(undefined);
                }}
              >
                <div
                  className={`camp-venue ${
                    roomClicked === room.title ? "clicked" : ""
                  }`}
                >
                  <div
                    className={`grid-room-btn ${
                      isUnderneathRoom && "isUnderneath"
                    }`}
                  >
                    <div
                      className="btn btn-white btn-small btn-block"
                      onClick={(e) => onJoinRoom(e, room)}
                    >
                      {venue.joinButtonText ?? "Join now"}
                    </div>
                  </div>
                  <div className="camp-venue-img">
                    <img
                      src={room.image_url}
                      title={room.title}
                      alt={room.title}
                    />
                  </div>
                  {venue.roomVisibility === RoomVisibility.hover &&
                    roomHovered &&
                    roomHovered.title === room.title && (
                      <div className="camp-venue-text">
                        <div className="camp-venue-maininfo">
                          <div className="camp-venue-title">{room.title}</div>
                          <CampAttendance
                            attendances={attendances}
                            venue={venue}
                            room={room}
                          />
                        </div>
                      </div>
                    )}

                  <div className={`camp-venue-text`}>
                    {(!venue.roomVisibility ||
                      venue.roomVisibility === RoomVisibility.nameCount ||
                      (venue.roomVisibility === RoomVisibility.count &&
                        hasAttendance)) && (
                      <div className="camp-venue-maininfo">
                        {(!venue.roomVisibility ||
                          venue.roomVisibility ===
                            RoomVisibility.nameCount) && (
                          <div className="camp-venue-title">{room.title}</div>
                        )}
                        <CampAttendance
                          attendances={attendances}
                          venue={venue}
                          room={room}
                        />
                      </div>
                    )}
                    <div className="camp-venue-secondinfo">
                      <div className="camp-venue-desc">
                        <p>{room.subtitle}</p>
                        <p>{room.about}</p>
                      </div>
                      <div className="camp-venue-actions">
                        {isExternalUrl(room.url) ? (
                          <a
                            className="btn btn-block btn-small btn-primary"
                            onClick={() => roomEnter(room)}
                            href={getRoomUrl(room.url)}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {venue.joinButtonText ?? "Join the room"}
                          </a>
                        ) : (
                          <a
                            className="btn btn-block btn-small btn-primary"
                            onClick={() => roomEnter(room)}
                            href={getRoomUrl(room.url)}
                          >
                            {venue.joinButtonText ?? "Join the room"}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        {selectedUserProfile && (
          <UserProfileModal
            show={!!selectedUserProfile}
            onHide={() => setSelectedUserProfile(undefined)}
            userProfile={selectedUserProfile}
          />
        )}
      </div>
    </>
  );
};
