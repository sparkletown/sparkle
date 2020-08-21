import React, { useState, useCallback, useMemo, useEffect } from "react";
import useConnectPartyGoers from "hooks/useConnectPartyGoers";
import useConnectCurrentVenue from "hooks/useConnectCurrentVenue";
import useUpdateLocationEffect from "utils/useLocationUpdateEffect";
import { useSelector } from "hooks/useSelector";
import { useUser } from "hooks/useUser";
import { BURN_START_UTC_SECONDS } from "settings";
import { PartyTitle } from "../PartyMap/components";
import UserList from "components/molecules/UserList";
import { CampRoomData } from "types/CampRoomData";
import CountDown from "components/molecules/CountDown";
import { Map } from "./components/Map";
import { RoomList } from "./components/RoomList";
import { RoomModal } from "./components/RoomModal";
import { CampVenue } from "types/CampVenue";
import ChatDrawer from "components/organisms/ChatDrawer";
import SparkleFairiesPopUp from "components/molecules/SparkleFairiesPopUp/SparkleFairiesPopUp";
import { peopleAttending } from "utils/venue";
import { useParams } from "react-router-dom";
import { InfoDrawer } from "components/molecules/InfoDrawer/InfoDrawer";
// import InformationLeftColumn from "components/organisms/InformationLeftColumn";
// import InformationCard from "components/molecules/InformationCard";

const Camp = () => {
  useConnectPartyGoers();
  useConnectCurrentVenue();

  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<CampRoomData>();

  const { user } = useUser();
  const { partygoers, venue } = useSelector((state) => ({
    venue: state.firestore.ordered.currentVenue?.[0] as CampVenue,
    partygoers: state.firestore.ordered.partygoers,
  }));

  const campLocation = `${venue.name}`;

  const location = useMemo(
    () =>
      isRoomModalOpen && selectedRoom ? selectedRoom?.title : campLocation,
    [isRoomModalOpen, selectedRoom, campLocation]
  );
  useUpdateLocationEffect(user, location);

  const usersInCamp = useMemo(
    () => venue && peopleAttending(partygoers, venue),
    [partygoers, venue]
  );

  const attendances = usersInCamp
    ? usersInCamp.reduce<Record<string, number>>((acc, value) => {
        acc[value.lastSeenIn] = (acc[value.lastSeenIn] || 0) + 1;
        return acc;
      }, {})
    : {};

  const modalHidden = useCallback(() => {
    setIsRoomModalOpen(false);
  }, []);

  const { roomTitle } = useParams();
  useEffect(() => {
    if (roomTitle) {
      const campRoom = venue?.rooms.find((room) => room.title === roomTitle);
      if (campRoom) {
        setSelectedRoom(campRoom);
        setIsRoomModalOpen(true);
      }
    }
  }, [roomTitle, setIsRoomModalOpen, setSelectedRoom, venue]);

  return (
    <div
      className="camp-container"
      style={{ marginLeft: 100, marginRight: 100 }}
    >
      <div className="small-right-margin">
        <PartyTitle
          startUtcSeconds={BURN_START_UTC_SECONDS}
          withCountDown={false}
        />
      </div>
      {usersInCamp && (
        <div className="col">
          <UserList users={usersInCamp} imageSize={50} disableSeeAll={false} />
        </div>
      )}
      <div className="col">
        <div className="starting-indication">
          {venue.config?.landingPageConfig.description}{" "}
          {venue.description?.program_url && (
            <a
              href={venue.description.program_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Event Program here
            </a>
          )}
        </div>
        <CountDown startUtcSeconds={BURN_START_UTC_SECONDS} />
      </div>
      <div className="row">
        <Map
          venue={venue}
          attendances={attendances}
          setSelectedRoom={setSelectedRoom}
          setIsRoomModalOpen={setIsRoomModalOpen}
        />
      </div>
      <div className="row">
        <div className="col">
          <RoomList
            rooms={venue.rooms}
            attendances={attendances}
            setSelectedRoom={setSelectedRoom}
            setIsRoomModalOpen={setIsRoomModalOpen}
          />
        </div>
      </div>
      <RoomModal
        show={isRoomModalOpen}
        room={selectedRoom}
        onHide={modalHidden}
      />
      <div className="chat-pop-up">
        <ChatDrawer roomName={venue.name} chatInputPlaceholder="Chat" />
      </div>
      <div className="sparkle-fairies">
        <SparkleFairiesPopUp />
      </div>
      <div className="info-drawer-camp">
        <InfoDrawer venue={venue} />
      </div>
    </div>
  );
};

export default Camp;
