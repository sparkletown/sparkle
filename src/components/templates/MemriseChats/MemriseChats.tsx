import UserProfilePicture from "components/molecules/UserProfilePicture";
import firebase from "firebase/app";
import { useSelector } from "hooks/useSelector";
import { useUser } from "hooks/useUser";
import React, { useState } from "react";
import { WithId } from "utils/id";
import { User } from "types/User";
import { useParams } from "react-router-dom";
import "./MemriseChats.scss";
import UserProfileModal from "components/organisms/UserProfileModal";
import ChatDrawer from "components/organisms/ChatDrawer";
type Props = {
  venueName: string;
};

const COLUMNS = 40;
const ROWS = 25;

const ROOMS = [
  {
    origin: {
      row: 1,
      column: 1,
    },
    width: 3,
    height: 4,
    image_url: "",
  },
  {
    origin: {
      row: 5,
      column: 5,
    },
    width: 5,
    height: 5,
    image_url: "",
  },
  {
    origin: {
      row: 20,
      column: 20,
    },
    width: 5,
    height: 5,
    image_url: "",
  },
];

const MemriseChats = ({ venueName }: Props) => {
  const { venueId } = useParams();
  const { user, profile } = useUser();
  const { venue, partygoers } = useSelector((state) => ({
    partygoers: state.firestore.ordered.partygoers,
    venue: state.firestore.data.currentVenue,
  }));
  const [selectedUserProfile, setSelectedUserProfile] = useState<
    WithId<User>
  >();

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
    console.log(partygoersBySeat);
    partygoersBySeat[row][column] = partygoer;
  });

  const takeSeat = (
    translatedRow: number | null,
    translatedColumn: number | null
  ) => {
    if (!user || !profile) return;
    const doc = `users/${user.uid}`;
    const existingData = profile?.data;
    const update = {
      data: {
        ...existingData,
        [venueId]: {
          row: translatedRow,
          column: translatedColumn,
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

  return (
    <>
      <div
        className="memrise-chats-container"
        style={{ backgroundImage: `url(${venue?.mapBackgroundImageUrl})` }}
      >
        {/* Use venue rooms when origin is provided */}
        {ROOMS.map((room, index) => {
          return (
            <>
              <div
                key={index}
                className="room"
                style={{
                  position: "absolute",
                  borderWidth: 2,
                  zIndex: 1,
                  borderColor: "#3E3838",
                  backgroundColor: "#3E3838",
                  left: -22 + room.origin.row * 46.8,
                  top: 65 - 32.3 + room.origin.column * 32.3,
                  width: room.width * 46,
                  height: 30,
                }}
              >
                Name placeholder
              </div>
              <div
                key={index}
                className="room"
                style={{
                  position: "absolute",
                  borderWidth: 2,
                  borderColor: "green",
                  backgroundColor: "rgba(0,255,0,0.2)",
                  left: -22 + room.origin.row * 46.8,
                  top: 65 + room.origin.column * 32.3,
                  width: room.width * 46,
                  height: room.height * 33,
                  backgroundImage: `url(${room?.image_url})`,
                }}
              ></div>
            </>
          );
        })}
        {Array.from(Array(COLUMNS)).map((_, colIndex) => {
          return (
            <div className="seat-row" key={colIndex}>
              {Array.from(Array(ROWS)).map((_, rowIndex) => {
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
          title={`${venue.name ?? "Memrise"} Chat`}
          roomName={venue.name}
          chatInputPlaceholder="Chat"
          defaultShow={true}
        />
      </div>
    </>
  );
};

export default MemriseChats;
