import UserProfilePicture from "components/molecules/UserProfilePicture";
import firebase from "firebase/app";
import { useSelector } from "hooks/useSelector";
import { useUser } from "hooks/useUser";
import React, { useState } from "react";
import { WithId } from "utils/id";
import { User } from "types/User";
import { useParams } from "react-router-dom";
import "./AvatarGrid.scss";
import UserProfileModal from "components/organisms/UserProfileModal";
import { AvatarGridRoom } from "types/AvatarGrid";
import { RoomModal } from "./RoomModal";
import ChatDrawer from "components/organisms/ChatDrawer";

type Props = {
  venueName: string;
};

const DEFAULT_COLUMNS = 40;
const DEFAULT_ROWS = 25;

const AvatarGrid = ({ venueName }: Props) => {
  const { venueId } = useParams();
  const { user, profile } = useUser();
  const { venue, partygoers } = useSelector((state) => ({
    partygoers: state.firestore.ordered.partygoers,
    venue: state.firestore.data.currentVenue,
  }));
  const [selectedUserProfile, setSelectedUserProfile] = useState<
    WithId<User>
  >();
  const [isRoomModalOpen, setIsRoomModalOpen] = useState<boolean>(false);
  const [selectedRoom, setSelectedRoom] = useState<AvatarGridRoom | undefined>(
    undefined
  );

  const partygoersBySeat: WithId<User>[][] = [];
  partygoers.forEach((partygoer) => {
    if (
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

  const takeSeat = (row: number, column: number) => {
    if (!user || !profile) return;
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
        style={{ backgroundImage: `url(${venue?.mapBackgroundImageUrl})` }}
      >
        {venue.spaces?.map((room, index) => {
          return (
            <>
              <div
                key={index}
                className="room-title"
                style={{
                  left: 17.5 + room.column * 4 + "vh",
                  top: room.row * 3.9 + "vh",
                  width: room.width * 4.3 + "vh",
                  height: "3.5vh",
                }}
              >
                {room.name}
              </div>
              <div
                key={index}
                className="room-border"
                onClick={() => {
                  setSelectedRoom(room);
                  setIsRoomModalOpen(true);
                }}
                style={{
                  left: 17.5 + room.column * 4 + "vh",
                  top: 3.5 + room.row * 4 + "vh",
                  width: room.width * 4.3 + "vh",
                  height: room.height * 3.8 + "vh",
                  backgroundImage: `url(${room?.image_url})`,
                }}
              ></div>
            </>
          );
        })}
        {Array.from(Array(columns)).map((_, colIndex) => {
          return (
            <div className="seat-row" key={colIndex}>
              {Array.from(Array(rows)).map((_, rowIndex) => {
                const column = colIndex + 1;
                const row = rowIndex + 1;
                const seatedPartygoer = partygoersBySeat?.[row]?.[column]
                  ? partygoersBySeat[row][column]
                  : null;
                return (
                  <div
                    className={seatedPartygoer ? "seat" : "not-seat"}
                    onClick={() => takeSeat(row, column)}
                    key={rowIndex}
                  >
                    {seatedPartygoer && (
                      <div className="user">
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
    </>
  );
};

export default AvatarGrid;
