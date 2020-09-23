import UserProfilePicture from "components/molecules/UserProfilePicture";
import firebase from "firebase/app";
import { useSelector } from "hooks/useSelector";
import { useUser } from "hooks/useUser";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { WithId } from "utils/id";
import { User } from "types/User";
import { useParams } from "react-router-dom";
import "./AvatarGrid.scss";
import { unstable_batchedUpdates } from "react-dom";
import UserProfileModal from "components/organisms/UserProfileModal";
import { AvatarGridRoom } from "types/AvatarGrid";
import { RoomModal } from "./RoomModal";
import ChatDrawer from "components/organisms/ChatDrawer";
import AvatarLayer from "../Playa/AvatarLayer";
import { UserVideoState } from "types/RelayMessage";
import { MenuConfig } from "../Playa/Playa";

type Props = {
  venueName: string;
};

const DEFAULT_COLUMNS = 40;
const DEFAULT_ROWS = 25;

const GATE_X = 1920;
const GATE_Y = 1080;

const AvatarGrid = ({ venueName }: Props) => {
  const [selectedUserProfile, setSelectedUserProfile] = useState<
    WithId<User>
  >();
  const [centerX, setCenterX] = useState(GATE_X);
  const [centerY, setCenterY] = useState(GATE_Y);
  const [myX, setMyX] = useState<number>();
  const [myY, setMyY] = useState<number>();
  const [centeredOnMe, setCenteredOnMe] = useState<boolean>();
  const [meIsLocated, setMeIsLocated] = useState(false);
  const [bikeMode, setBikeMode] = useState<boolean | undefined>(false);
  const [videoState, setVideoState] = useState<string>();
  const [away, setAway] = useState(false);
  const [heartbeat, setHeartbeat] = useState<number>();

  const toggleBikeMode = useCallback(() => {
    setBikeMode(!bikeMode);
  }, [bikeMode]);
  const toggleVideoState = useCallback(() => {
    setVideoState((prev) =>
      prev === UserVideoState.Open ? UserVideoState.Locked : UserVideoState.Open
    );
  }, []);

  const [movingUp, setMovingUp] = useState(false);
  const [movingDown, setMovingDown] = useState(false);
  const [movingLeft, setMovingLeft] = useState(false);
  const [movingRight, setMovingRight] = useState(false);

  const { venueId } = useParams();
  const { user, profile } = useUser();
  const { venue, partygoers } = useSelector((state) => ({
    partygoers: state.firestore.ordered.partygoers,
    venue: state.firestore.data.currentVenue,
  }));
  const [showUserTooltip, setShowUserTooltip] = useState(false);
  const [hoveredUser, setHoveredUser] = useState<User | null>();
  const userRef = useRef<HTMLDivElement | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [menu, setMenu] = useState<MenuConfig>();
  const menuRef = useRef<HTMLDivElement | null>(null);
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

  useEffect(() => {
    setCenteredOnMe(myX === centerX && myY === centerY);
  }, [centerX, centerY, myX, myY]);

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

  const setMyLocation = useMemo(
    () => (x: number, y: number) => {
      unstable_batchedUpdates(() => {
        setCenterX(x);
        setCenterY(y);
        setMyX(x);
        setMyY(y);
        setMeIsLocated(true);
      });
    },
    []
  );

  const avatarLayer = useMemo(
    () => (
      <AvatarLayer
        bikeMode={bikeMode}
        setBikeMode={setBikeMode}
        videoState={videoState}
        setVideoState={setVideoState}
        toggleVideoState={toggleVideoState}
        away={away}
        setAway={setAway}
        heartbeat={heartbeat}
        setHeartbeat={setHeartbeat}
        movingUp={movingUp}
        movingDown={movingDown}
        movingLeft={movingLeft}
        movingRight={movingRight}
        setMyLocation={setMyLocation}
        setSelectedUserProfile={setSelectedUserProfile}
        setShowUserTooltip={setShowUserTooltip}
        setHoveredUser={setHoveredUser}
        setShowMenu={setShowMenu}
        setMenu={setMenu}
        userRef={userRef}
        menuRef={menuRef}
      />
    ),
    [
      bikeMode,
      videoState,
      away,
      heartbeat,
      movingUp,
      movingDown,
      movingLeft,
      movingRight,
      setMyLocation,
      toggleVideoState,
    ]
  );

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
        {avatarLayer}
        {meIsLocated && (
          <div className="avatar-controls">
            <div
              className="up"
              onMouseDown={(event) => {
                setMovingUp(true);
                event.preventDefault();
              }}
              onTouchStart={(event) => {
                setMovingUp(true);
                event.preventDefault();
              }}
              onMouseUp={() => setMovingUp(false)}
              onTouchEnd={() => setMovingUp(false)}
            >
              <div className="btn" />
            </div>
            <div
              className="down"
              onMouseDown={(event) => {
                setMovingDown(true);
                event.preventDefault();
              }}
              onTouchStart={(event) => {
                setMovingDown(true);
                event.preventDefault();
              }}
              onMouseUp={() => setMovingDown(false)}
              onTouchEnd={() => setMovingDown(false)}
            >
              <div className="btn" />
            </div>
            <div
              className="left"
              onMouseDown={(event) => {
                setMovingLeft(true);
                event.preventDefault();
              }}
              onTouchStart={(event) => {
                setMovingLeft(true);
                event.preventDefault();
              }}
              onMouseUp={() => setMovingLeft(false)}
              onTouchEnd={() => setMovingLeft(false)}
            >
              <div className="btn" />
            </div>
            <div
              className="right"
              onMouseDown={(event) => {
                setMovingRight(true);
                event.preventDefault();
              }}
              onTouchStart={(event) => {
                setMovingRight(true);
                event.preventDefault();
              }}
              onMouseUp={() => setMovingRight(false)}
              onTouchEnd={() => setMovingRight(false)}
            >
              <div className="btn" />
            </div>
          </div>
        )}
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
                }}
              ></div>
              <div
                key={index}
                className="room-border"
                onClick={() => {
                  setSelectedRoom(room);
                  setIsRoomModalOpen(true);
                }}
                style={{
                  zIndex: 3,
                  left: 17.5 + room.column * 4 + "vh",
                  top: 3.5 + room.row * 4 + "vh",
                  width: room.width * 4.3 + "vh",
                  height: (room.height - 1) * 3.8 + "vh",
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
