import React, { useCallback, useEffect, useRef, useState } from "react";
import { CampVenue } from "types/CampVenue";
import { CampRoomData } from "types/CampRoomData";
import "./Map.scss";
import { enterRoom } from "../../../../utils/useLocationUpdateEffect";
import { useUser } from "../../../../hooks/useUser";
import { IS_BURN } from "secrets";
import { RoomVisibility } from "types/Venue";
import { useDispatch } from "hooks/useDispatch";
import { retainAttendance } from "store/actions/Attendance";
import { currentTimeInUnixEpoch } from "utils/time";
import UserProfilePicture from "components/molecules/UserProfilePicture";
import { User } from "types/User";
import { WithId } from "utils/id";
import { useVenueId } from "hooks/useVenueId";
import firebase from "firebase/app";
import UserProfileModal from "components/organisms/UserProfileModal";

interface PropsType {
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

export const Map: React.FC<PropsType> = ({
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
  const [roomsRefs, setRoomsRefs] = useState<
    { [key: string]: HTMLDivElement }[]
  >([]);

  const columns = venue.columns ?? DEFAULT_COLUMNS;
  const rows = venue.rows ?? DEFAULT_ROWS;
  const rooms = [...venue.rooms];
  const currentPosition = profile?.data?.[venue.id];
  const myAvatarRef = useRef();

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

  const hitRoom = useCallback(() => {
    let isHitting = false;
    rooms.forEach((room: CampRoomData) => {
      const ref = roomsRefs.find((roomRef) => roomRef[room.title]);
      const roomRef = ref?.[room.title].getBoundingClientRect();
      const myAvatar: any = myAvatarRef.current;
      const avatarPosition = myAvatar.getBoundingClientRect();
      const rowPosition = avatarPosition.y + avatarPosition.height / 2;
      const colPosition = avatarPosition.x + avatarPosition.width / 2;
      const roomX = Math.round(roomRef!.x);
      const roomY = Math.round(roomRef!.y);
      const roomWidth = Math.round(roomRef!.width);
      const roomHeight = Math.round(roomRef!.height);

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
  }, [isHittingRoom, rooms, roomsRefs, selectedRoom, setSelectedRoom]);

  const isExternalLink = useCallback(
    (url: string) =>
      url.includes("http") &&
      new URL(window.location.href).host !== new URL(getRoomUrl(url)).host,
    []
  );

  const roomEnter = useCallback(
    (room: CampRoomData) => {
      room &&
        user &&
        enterRoom(
          user,
          { [`${venue.name}/${room.title}`]: currentTimeInUnixEpoch },
          profile?.lastSeenIn
        );
    },
    [profile, user, venue]
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

        const isExternalUrl = isExternalLink(selectedRoom.url);
        window.open(
          getRoomUrl(selectedRoom.url),
          isExternalUrl ? "_blank" : "noopener,noreferrer"
        );
        roomEnter(selectedRoom);
        return;
      }
      if (downPress) {
        setKeyDown(true);
        setTimeout(() => setKeyDown(false), MOVEMENT_INTERVAL);
        if (row + 1 > DEFAULT_ROWS || seatTaken(row + 1, column)) {
          return;
        }
        hitRoom();
        takeSeat(row + 1, column);
        return;
      }
      if (upPress) {
        setKeyDown(true);
        setTimeout(() => setKeyDown(false), MOVEMENT_INTERVAL);
        if (row - 1 < 1 || seatTaken(row - 1, column)) {
          return;
        }
        hitRoom();
        takeSeat(row - 1, column);
        return;
      }
      if (leftPress) {
        setKeyDown(true);
        setTimeout(() => setKeyDown(false), MOVEMENT_INTERVAL);
        if (column - 1 < 1 || seatTaken(row, column - 1)) {
          return;
        }
        hitRoom();
        takeSeat(row, column - 1);
        return;
      }
      if (rightPress) {
        setKeyDown(true);
        setTimeout(() => setKeyDown(false), MOVEMENT_INTERVAL);
        if (column + 1 > DEFAULT_COLUMNS || seatTaken(row, column + 1)) {
          return;
        }
        hitRoom();
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
    isExternalLink,
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

  const getRoomUrl = (roomUrl: string) => {
    return roomUrl.includes("http") ? roomUrl : "//" + roomUrl;
  };

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
    if (isHittingRoom && selectedRoom) {
      setSelectedRoom(undefined);
      setIsHittingRoom(false);
    }
  };

  return (
    <>
      <div className="map-content">
        <img
          width="100%"
          src={venue.mapBackgroundImageUrl}
          alt="map-background"
        />

        <div className="rooms-content">
          {!!rooms.length &&
            rooms.map((room) => {
              const left = room.x_percent;
              const top = room.y_percent;
              const width = room.width_percent;
              const height = room.height_percent;
              const isUnderneathRoom = isHittingRoom && room === selectedRoom;

              return (
                <div
                  ref={(el) => {
                    if (!el) return;
                    const checkForRoom = roomsRefs.find(
                      (roomRef) => roomRef[room.title]
                    );
                    if (!checkForRoom) {
                      const prevRefs = [...roomsRefs, { [room.title]: el }];
                      setRoomsRefs(prevRefs);
                    }
                  }}
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
                        onClick={(e) => {
                          e.stopPropagation();
                          const isExternalUrl = isExternalLink(room.url);
                          window.open(
                            getRoomUrl(room.url),
                            isExternalUrl ? "_blank" : "noopener,noreferrer"
                          );
                          roomEnter(room);
                        }}
                        className="btn btn-white btn-small btn-block"
                      >
                        Join now
                      </div>
                    </div>
                    <div className="camp-venue-img">
                      <img
                        src={room.image_url}
                        title={room.title}
                        alt={room.title}
                      />
                    </div>
                    {venue.roomVisibility === RoomVisibility.nameCount &&
                      roomHovered &&
                      roomHovered.title === room.title && (
                        <div className="camp-venue-text">
                          <div className="camp-venue-maininfo">
                            <div className="camp-venue-title">{room.title}</div>

                            {(attendances[`${venue.name}/${room.title}`] ?? 0) +
                              (room.attendanceBoost ?? 0) >
                              0 && (
                              <div className="camp-venue-people">
                                {(attendances[`${venue.name}/${room.title}`] ??
                                  0) + (room.attendanceBoost ?? 0)}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                    <div className={`camp-venue-text`}>
                      {(!venue.roomVisibility ||
                        venue.roomVisibility === RoomVisibility.nameCount ||
                        venue.roomVisibility === RoomVisibility.count) && (
                        <div className="camp-venue-maininfo">
                          {(!venue.roomVisibility ||
                            venue.roomVisibility ===
                              RoomVisibility.nameCount) && (
                            <div className="camp-venue-title">{room.title}</div>
                          )}

                          {(attendances[`${venue.name}/${room.title}`] ?? 0) +
                            (room.attendanceBoost ?? 0) >
                            0 && (
                            <div className="camp-venue-people">
                              {(attendances[`${venue.name}/${room.title}`] ??
                                0) + (room.attendanceBoost ?? 0)}
                            </div>
                          )}
                        </div>
                      )}
                      <div className="camp-venue-secondinfo">
                        <div className="camp-venue-desc">
                          <p>{room.subtitle}</p>
                          <p>{room.about}</p>
                        </div>
                        <div className="camp-venue-actions">
                          {isExternalLink(room.url) ? (
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
        </div>

        <div
          className="grid-container"
          style={{
            gridTemplateColumns: `repeat(${columns}, calc(100% / ${columns}))`,
            gridTemplateRows: `repeat(${rows}, 1fr)`,
          }}
        >
          {Array.from(Array(columns)).map((_, colIndex) => {
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
                          forwardRef={(ref) => {
                            if (!ref) return;
                            myAvatarRef.current = ref;
                          }}
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
          })}
        </div>

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
