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

const DEFAULT_COLUMNS = 40;
const DEFAULT_ROWS = 25;

const AvatarGrid = () => {
  const [selectedUserProfile, setSelectedUserProfile] = useState<
    WithId<User>
  >();

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

  const partygoersBySeat: WithId<User>[][] = [];
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

  const useKeyPress = function (targetKey: string) {
    const [keyPressed, setKeyPressed] = useState(false);

    function downHandler({ key }: { key: string }) {
      if (key === targetKey) {
        setKeyPressed(true);
      }
    }

    const upHandler = ({ key }: { key: string }) => {
      if (key === targetKey) {
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

  useEffect(() => {
    if (!venueId) return;

    const currentPosition = profile?.data?.[venueId];
    if (!currentPosition?.row && !currentPosition?.column) {
      return;
    }
    const { row, column } = currentPosition;
    if (row && column) {
      const hitRoom = (r: number, c: number) => {
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
          }
        });
        return isHitting;
      };
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
    venue,
    rightPress,
    takeSeat,
    upPress,
    venueId,
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
        }}
      >
        {venue.spaces?.map((room, index) => {
          return (
            <div key={`room${index}`}>
              <div
                className="room-title"
                style={{
                  zIndex: 2,
                  left: 15,
                  marginLeft: (room.column - 1) * 4 + "vh",
                  marginTop: (room.row - 2) * 4 + "vh",
                  width: room.width * 4.8 + "vh",
                  height: "3.5vh",
                }}
              >
                {room.name}
              </div>
              <div
                className="room-border"
                onClick={() => {
                  setSelectedRoom(room);
                  setIsRoomModalOpen(true);
                }}
                style={{
                  left: 15,
                  marginLeft: (room.column - 1) * 4 + "vh",
                  marginTop: (room.row - 1) * 4 + "vh",
                  width: room.width * 4.8 + "vh",
                  height: room.height * 3.8 + "vh",
                }}
              ></div>
              <div
                className="room-area"
                onClick={() => {
                  setSelectedRoom(room);
                  setIsRoomModalOpen(true);
                }}
                style={{
                  left: 15,
                  zIndex: room?.image_url ? 1 : -1,
                  marginLeft: (room.column - 1) * 4 + "vh",
                  marginTop: (room.row - 1) * 4 + "vh",
                  width: room.width * 4.8 + "vh",
                  height: (room.height - 1) * 3.8 + "vh",
                  backgroundImage: `url(${room?.image_url})`,
                }}
              ></div>
            </div>
          );
        })}
        {Array.from(Array(columns)).map((_, colIndex) => {
          return (
            <div className="seat-row" key={`col${colIndex}`}>
              {Array.from(Array(rows)).map((_, rowIndex) => {
                const column = colIndex + 1;
                const row = rowIndex + 1;
                const seatedPartygoer = partygoersBySeat?.[row]?.[column]
                  ? partygoersBySeat[row][column]
                  : null;
                const isMe = seatedPartygoer?.id === user?.uid;
                return (
                  <div
                    className={seatedPartygoer ? "seat" : "not-seat"}
                    onClick={() =>
                      !seatedPartygoer ? takeSeat(row, column) : null
                    }
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
                );
              })}
            </div>
          );
        })}
      </div>
      <UserProfileModal
        show={selectedUserProfile !== undefined}
        onHide={() => setSelectedUserProfile(undefined)}
        userProfile={selectedUserProfile}
      />
      <div className="chat-container">
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
