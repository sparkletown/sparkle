import React, { useCallback, useEffect, useState } from "react";
import firebase from "firebase/app";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

// Components
import { RoomModal } from "./RoomModal";
import Announcement from "./Announcement";
import ChatDrawer from "components/organisms/ChatDrawer";
import UserProfileModal from "components/organisms/UserProfileModal";
import UserProfilePicture from "components/molecules/UserProfilePicture";

// Hooks
import { useSelector } from "hooks/useSelector";
import { useUser } from "hooks/useUser";
import { useVenueId } from "hooks/useVenueId";
import { usePartygoers } from "hooks/users";

// Utils | Settings | Constants
import { WithId } from "utils/id";
import { openRoomWithCounting } from "utils/useLocationUpdateEffect";
import { currentVenueSelector } from "utils/selectors";

// Typings
import { AvatarGridRoom } from "types/AvatarGrid";
import { User } from "types/User";

// Styles
import "./AvatarGrid.scss";

const DEFAULT_COLUMNS = 40;
const DEFAULT_ROWS = 25;

const AvatarGrid = () => {
  const venueId = useVenueId();
  const { user, profile } = useUser();

  const venue = useSelector(currentVenueSelector);
  const partygoers = usePartygoers();

  const [isRoomModalOpen, setIsRoomModalOpen] = useState<boolean>(false);
  const [selectedRoom, setSelectedRoom] = useState<AvatarGridRoom | undefined>(
    undefined
  );
  const [selectedUserProfile, setSelectedUserProfile] = useState<
    WithId<User>
  >();
  const [keyDown, setKeyDown] = useState(false);
  const [isHittingRoom, setIsHittingRoom] = useState(false);

  const enterAvatarGridRoom = useCallback(
    (room: AvatarGridRoom) => {
      if (!venue) return;

      openRoomWithCounting({ user, profile, venue, room });
    },
    [profile, user, venue]
  );

  // FIXME: This is really bad, needs to be fixed ASAP
  const partygoersBySeat: WithId<User>[][] = [];
  partygoers &&
    partygoers.forEach((partygoer) => {
      if (
        !venueId ||
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

  const onSeatClick = (
    row: number,
    column: number,
    seatedPartygoer: WithId<User> | null
  ) => {
    if (!seatedPartygoer) {
      takeSeat(row, column);
    }
    venue?.spaces?.forEach((room) => {
      if (
        !seatedPartygoer &&
        row >= room.row &&
        row <= room.row + room.height - 1 &&
        column >= room.column &&
        column <= room.column + room.width - 1
      ) {
        setSelectedRoom(room);
        setIsRoomModalOpen(true);
      } else {
        if (isHittingRoom && selectedRoom) {
          setSelectedRoom(undefined);
          setIsHittingRoom(false);
        }
      }
    });
  };

  const useKeyPress = function (targetKey: string) {
    const [keyPressed, setKeyPressed] = useState(false);

    function downHandler({ key }: { key: string }) {
      if (key === targetKey) {
        setKeyPressed(true);
      }
    }

    const upHandler = ({ key }: { key: string }) => {
      if (key === targetKey) {
        setKeyDown(false);
        setKeyPressed(false);
      }
    };

    useEffect(() => {
      window.addEventListener("keydown", downHandler);
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
      venue?.spaces?.forEach((room) => {
        if (
          r >= room.row &&
          r <= room.row + room.height - 1 &&
          c >= room.column &&
          c <= room.column + room.width - 1
        ) {
          setSelectedRoom(room);
          setIsHittingRoom(true);
          isHitting = true;
        } else {
          if (isHittingRoom && selectedRoom === room) {
            setSelectedRoom(undefined);
            setIsHittingRoom(false);
          }
        }
      });
      return isHitting;
    },
    [isHittingRoom, selectedRoom, venue]
  );

  useEffect(() => {
    if (!venueId) return;

    const currentPosition = profile?.data?.[venueId];
    if ((!currentPosition?.row && !currentPosition?.column) || keyDown) {
      return;
    }

    setKeyDown(true);

    const { row, column } = currentPosition;
    if (row && column) {
      const seatTaken = (r: number, c: number) => partygoersBySeat?.[r]?.[c];
      if (enterPress && selectedRoom) {
        enterAvatarGridRoom(selectedRoom);
      }
      if (downPress) {
        if (row + 1 > DEFAULT_ROWS || seatTaken(row + 1, column)) {
          return;
        }
        hitRoom(row + 1, column);
        takeSeat(row + 1, column);
      }
      if (upPress) {
        if (row - 1 < 1 || seatTaken(row - 1, column)) {
          return;
        }
        hitRoom(row - 1, column);
        takeSeat(row - 1, column);
        return;
      }
      if (leftPress) {
        if (column - 1 < 1 || seatTaken(row, column - 1)) {
          return;
        }
        hitRoom(row, column - 1);

        takeSeat(row, column - 1);
        return;
      }
      if (rightPress) {
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
    leftPress,
    partygoersBySeat,
    profile,
    rightPress,
    takeSeat,
    upPress,
    user,
    venue,
    hitRoom,
    venueId,
    keyDown,
    enterPress,
    selectedRoom,
    enterAvatarGridRoom,
  ]);

  const checkAdjacentSeats = (row: number, column: number): boolean => {
    const top =
      partygoersBySeat?.[row + 1]?.[column] &&
      partygoersBySeat?.[row + 1]?.[column].id === user?.uid;
    const bottom =
      partygoersBySeat?.[row - 1]?.[column] &&
      partygoersBySeat?.[row - 1]?.[column].id === user?.uid;
    const right =
      partygoersBySeat?.[row]?.[column + 1] &&
      partygoersBySeat?.[row]?.[column + 1].id === user?.uid;
    const left =
      partygoersBySeat?.[row]?.[column - 1] &&
      partygoersBySeat?.[row]?.[column - 1].id === user?.uid;

    return top || bottom || right || left;
  };

  const checkNearAdjacentSeats = (row: number, column: number): boolean => {
    const top =
      partygoersBySeat?.[row + 2]?.[column] &&
      partygoersBySeat?.[row + 2]?.[column].id === user?.uid;
    const topRight =
      partygoersBySeat?.[row + 1]?.[column - 1] &&
      partygoersBySeat?.[row + 1]?.[column - 1].id === user?.uid;
    const topRightLong =
      partygoersBySeat?.[row + 2]?.[column - 2] &&
      partygoersBySeat?.[row + 2]?.[column - 2].id === user?.uid;
    const topRightHorizontal =
      partygoersBySeat?.[row + 2]?.[column - 1] &&
      partygoersBySeat?.[row + 2]?.[column - 1].id === user?.uid;
    const topRightVertical =
      partygoersBySeat?.[row + 1]?.[column - 2] &&
      partygoersBySeat?.[row + 1]?.[column - 2].id === user?.uid;
    const topLeft =
      partygoersBySeat?.[row + 1]?.[column + 1] &&
      partygoersBySeat?.[row + 1]?.[column + 1].id === user?.uid;
    const topLeftLong =
      partygoersBySeat?.[row + 2]?.[column + 2] &&
      partygoersBySeat?.[row + 2]?.[column + 2].id === user?.uid;
    const topLeftHorizontal =
      partygoersBySeat?.[row + 2]?.[column + 1] &&
      partygoersBySeat?.[row + 2]?.[column + 1].id === user?.uid;
    const topLeftVertical =
      partygoersBySeat?.[row + 1]?.[column + 2] &&
      partygoersBySeat?.[row + 1]?.[column + 2].id === user?.uid;
    const bottom =
      partygoersBySeat?.[row - 2]?.[column] &&
      partygoersBySeat?.[row - 2]?.[column].id === user?.uid;
    const bottomRight =
      partygoersBySeat?.[row - 1]?.[column - 1] &&
      partygoersBySeat?.[row - 1]?.[column - 1].id === user?.uid;
    const bottomRightLong =
      partygoersBySeat?.[row - 2]?.[column - 2] &&
      partygoersBySeat?.[row - 2]?.[column - 2].id === user?.uid;
    const bottomRightHorizontal =
      partygoersBySeat?.[row - 2]?.[column - 1] &&
      partygoersBySeat?.[row - 2]?.[column - 1].id === user?.uid;
    const bottomRightVertical =
      partygoersBySeat?.[row - 1]?.[column - 2] &&
      partygoersBySeat?.[row - 1]?.[column - 2].id === user?.uid;
    const bottomLeft =
      partygoersBySeat?.[row - 1]?.[column + 1] &&
      partygoersBySeat?.[row - 1]?.[column + 1].id === user?.uid;
    const bottomLeftLong =
      partygoersBySeat?.[row - 2]?.[column + 2] &&
      partygoersBySeat?.[row - 2]?.[column + 2].id === user?.uid;
    const bottomLeftHorizontal =
      partygoersBySeat?.[row - 2]?.[column + 1] &&
      partygoersBySeat?.[row - 2]?.[column + 1].id === user?.uid;
    const bottomLeftVertical =
      partygoersBySeat?.[row - 1]?.[column + 2] &&
      partygoersBySeat?.[row - 1]?.[column + 2].id === user?.uid;
    const left =
      partygoersBySeat?.[row]?.[column + 2] &&
      partygoersBySeat?.[row]?.[column + 2].id === user?.uid;
    const right =
      partygoersBySeat?.[row]?.[column - 2] &&
      partygoersBySeat?.[row]?.[column - 2].id === user?.uid;

    return (
      top ||
      topLeft ||
      topLeftLong ||
      topLeftHorizontal ||
      topLeftVertical ||
      topRight ||
      topRightLong ||
      topRightHorizontal ||
      topRightVertical ||
      bottom ||
      bottomLeft ||
      bottomLeftLong ||
      bottomLeftHorizontal ||
      bottomLeftVertical ||
      bottomRight ||
      bottomRightLong ||
      bottomRightHorizontal ||
      bottomRightVertical ||
      right ||
      left
    );
  };

  if (!venue) {
    return null;
  }

  const columns = venue.columns ?? DEFAULT_COLUMNS;
  const rows = venue.rows ?? DEFAULT_ROWS;

  return (
    <>
      <div
        className="avatar-grid-container"
        style={{
          height: window.innerHeight,
          backgroundImage: `url(${venue.mapBackgroundImageUrl})`,
          backgroundSize: "cover",
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, calc(100% / ${columns}))`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
        }}
      >
        <div className="grid-rooms-container">
          {venue.spaces?.map((room: AvatarGridRoom, index: number) => {
            const peopleInRoom = partygoers
              ? partygoers.filter(
                  (partygoer) =>
                    partygoer.lastSeenIn?.[`${venue.name}/${room.title}`]
                )
              : [];
            return (
              <div
                style={{
                  backgroundImage: `url(${room.image_url})`,
                  width: `calc((100% / 40) * ${room.width})`,
                  height: `calc((100% / 25)* ${room.height})`,
                  left: `calc((100% / 40) * ${room.column - 1})`,
                  top: `calc((100% / 25) * ${room.row - 1})`,
                }}
                className={`grid-room grid-room-blue ${
                  isHittingRoom && room === selectedRoom && "hitting-room"
                }`}
                key={`${room.title}-${index}`}
              >
                <div
                  className={`grid-room-info-btn ${
                    isHittingRoom && room === selectedRoom && "hitting-room"
                  }`}
                >
                  <FontAwesomeIcon
                    onClick={() => {
                      setSelectedRoom(room);
                      setIsRoomModalOpen(true);
                    }}
                    className={"search-icon"}
                    icon={faInfoCircle}
                  />
                </div>
                <div className="grid-room-title">{room.title}</div>
                <div className="grid-room-infos">
                  <div
                    className={`grid-room-btn ${
                      isHittingRoom && room === selectedRoom && "hitting-room"
                    }`}
                  >
                    <div
                      onClick={() => enterAvatarGridRoom(room)}
                      className="btn btn-white btn-small btn-block"
                    >
                      Join now
                    </div>
                  </div>

                  {peopleInRoom.length ? (
                    <div
                      className={`grid-room-people ${
                        isHittingRoom && room === selectedRoom && "hitting-room"
                      }`}
                    >
                      {peopleInRoom.map((roomPerson, index) => {
                        if (index + 1 < room.width) {
                          return (
                            <div
                              key={index}
                              style={{
                                backgroundImage: `url(${roomPerson.pictureUrl})`,
                              }}
                              className={`grid-room-avatar grid-room-avatar-${
                                index + 1
                              }`}
                            ></div>
                          );
                        }
                        return null;
                      })}
                      {peopleInRoom.length >= room.width && (
                        <div className="grid-room-avatar grid-room-avatar-more">
                          +{peopleInRoom.length - room.width + 1}
                        </div>
                      )}
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {Array.from(Array(columns)).map((_, colIndex) => {
          return (
            <div className="seat-row" key={`column${colIndex}`}>
              {Array.from(Array(rows)).map((_, rowIndex) => {
                const column = colIndex + 1;
                const row = rowIndex + 1;
                const seatedPartygoer = partygoersBySeat?.[row]?.[column]
                  ? partygoersBySeat[row][column]
                  : null;
                const isMe = seatedPartygoer?.id === user?.uid;
                const isAdjacentSeat = checkAdjacentSeats(row, column);
                const isNearAdjacentSeat = checkNearAdjacentSeats(row, column);
                return (
                  <div key={`row${rowIndex}`} className={`seat-container`}>
                    <div
                      className={
                        seatedPartygoer
                          ? "seat"
                          : `not-seat ${isAdjacentSeat ? "adjacent" : ""} ${
                              isNearAdjacentSeat ? "near-adjacent" : ""
                            }`
                      }
                      onClick={() => onSeatClick(row, column, seatedPartygoer)}
                      key={`row${rowIndex}`}
                    >
                      {seatedPartygoer && (
                        <div className={isMe ? "user me" : "user"}>
                          <UserProfilePicture
                            user={seatedPartygoer}
                            avatarClassName={"profile-avatar"}
                            setSelectedUserProfile={setSelectedUserProfile}
                            miniAvatars={venue?.miniAvatars}
                          />
                        </div>
                      )}
                    </div>
                  </div>
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
      <div className="avatargrid-chat-drawer-container">
        <ChatDrawer
          title={`${venue.name ?? "Grid"} Chat`}
          roomName={venue.name}
          chatInputPlaceholder="Chat"
          defaultShow={false}
        />
      </div>
      <RoomModal
        show={isRoomModalOpen}
        room={selectedRoom}
        miniAvatars={venue.miniAvatars}
        onHide={() => {
          setSelectedRoom(undefined);
          setIsRoomModalOpen(false);
        }}
      />
      <Announcement
        message={venue.bannerMessage}
        className="announcement-container"
      />
    </>
  );
};

export default AvatarGrid;
