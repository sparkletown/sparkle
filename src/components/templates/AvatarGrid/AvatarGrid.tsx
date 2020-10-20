import UserProfilePicture from "components/molecules/UserProfilePicture";
import firebase from "firebase/app";
import { useSelector } from "hooks/useSelector";
import { useUser } from "hooks/useUser";
import React, { useCallback, useEffect, useState } from "react";
import { WithId } from "utils/id";
import { User } from "types/User";
import "./AvatarGrid.scss";
import UserProfileModal from "components/organisms/UserProfileModal";
import { AvatarGridRoom } from "types/AvatarGrid";
import Announcement from "./Announcement";
import { RoomModal } from "./RoomModal";
import ChatDrawer from "components/organisms/ChatDrawer";
import { useVenueId } from "hooks/useVenueId";

type Props = {
  venueName: string;
};

const DEFAULT_COLUMNS = 40;
const DEFAULT_ROWS = 25;

const AvatarGrid = () => {
  const venueId = useVenueId();
  const { user, profile } = useUser();
  const { venue, partygoers } = useSelector((state) => ({
    partygoers: state.firestore.ordered.partygoers,
    venue: state.firestore.data.currentVenue,
  }));
  const [isRoomModalOpen, setIsRoomModalOpen] = useState<boolean>(false);
  const [selectedRoom, setSelectedRoom] = useState<AvatarGridRoom | undefined>(
    undefined
  );
  const [selectedUserProfile, setSelectedUserProfile] = useState<
    WithId<User>
  >();
  const [keyDown, setKeyDown] = useState(false);

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
          setIsRoomModalOpen(true);
          isHitting = true;
        } else {
          if (isRoomModalOpen) {
            setSelectedRoom(undefined);
            setIsRoomModalOpen(false);
          }
        }
      });
      return isHitting;
    },
    [isRoomModalOpen, venue]
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
      if (downPress) {
        if (
          row + 1 > DEFAULT_ROWS ||
          seatTaken(row + 1, column) ||
          hitRoom(row + 1, column)
        ) {
          return;
        }
        takeSeat(row + 1, column);
      }
      if (upPress) {
        if (
          row - 1 < 1 ||
          seatTaken(row - 1, column) ||
          hitRoom(row - 1, column)
        ) {
          return;
        }
        takeSeat(row - 1, column);
        return;
      }
      if (leftPress) {
        if (
          column - 1 < 1 ||
          seatTaken(row, column - 1) ||
          hitRoom(row, column - 1)
        ) {
          return;
        }
        takeSeat(row, column - 1);
        return;
      }
      if (rightPress) {
        if (
          column + 1 > DEFAULT_COLUMNS ||
          seatTaken(row, column + 1) ||
          hitRoom(row, column + 1)
        ) {
          return;
        }
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
  ]);

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
          backgroundImage: `url(${venue.mapBackgroundImageUrl})`,
          backgroundSize: "cover",
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, calc(100% / 40))`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
        }}
      >
        <div className="grid-rooms-container">
          {venue.spaces?.map((room: AvatarGridRoom, index: number) => {
            const peopleInRoom = partygoers.filter(
              (partygoer) => partygoer.lastSeenIn[room.title]
            );
            return (
              <div
                onClick={() => {
                  setSelectedRoom(room);
                  setIsRoomModalOpen(true);
                }}
                style={{
                  backgroundImage: `url(${room.image_url})`,
                  width: `calc((100% / 40) * ${room.width})`,
                  height: `calc((100% / 25)* ${room.height})`,
                  left: `calc((100% / 40) * ${room.column - 1})`,
                  top: `calc((100% / 25) * ${room.row - 1})`,
                }}
                className={`grid-room grid-room_blue`}
                key={`${room.title}-${index}`}
              >
                <div className="grid-room-title">{room.title}</div>
                <div className="grid-room-infos">
                  <div className="grid-room-btn">
                    <div className="btn btn-white btn-small btn-block">
                      Join now
                    </div>
                  </div>

                  {peopleInRoom.length ? (
                    <div className="grid-room-people">
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
                return (
                  <div
                    key={`row${rowIndex}`}
                    className={`seat-container row-${row} column-${column}`}
                  >
                    <div
                      className={seatedPartygoer ? "seat" : "not-seat"}
                      onClick={() => onSeatClick(row, column, seatedPartygoer)}
                      key={`row${rowIndex}`}
                    >
                      {seatedPartygoer && (
                        <div className={isMe ? "user me" : "user"}>
                          <UserProfilePicture
                            user={seatedPartygoer}
                            profileStyle={"profile-avatar"}
                            setSelectedUserProfile={setSelectedUserProfile}
                            miniAvatars={venue?.miniAvatars}
                            imageSize={undefined}
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
