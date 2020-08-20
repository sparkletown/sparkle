import React, { useState, useCallback } from "react";
import useConnectPartyGoers from "hooks/useConnectPartyGoers";
import useConnectCurrentVenue from "hooks/useConnectCurrentVenue";
import useUpdateLocationEffect, {
  updateLocationData,
} from "utils/useLocationUpdateEffect";
import { useSelector } from "hooks/useSelector";
import { useUser } from "hooks/useUser";
import { BURN_START_UTC_SECONDS } from "settings";
import { PartyTitle } from "../PartyMap/components";
import UserList from "components/molecules/UserList";
import { CampRoomData } from "types/CampRoomData";
import CountDown from "components/molecules/CountDown";
import Chatbox from "components/organisms/Chatbox";
import { Map } from "./components/Map";
import { RoomList } from "./components/RoomList";
import { RoomModal } from "./components/RoomModal";
import { CampVenue } from "types/CampVenue";
import ChatDrawer from "components/organisms/ChatDrawer";
import InformationLeftColumn from "components/organisms/InformationLeftColumn";
import InformationCard from "components/molecules/InformationCard";

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

  useUpdateLocationEffect(user, campLocation);

  const attendances = partygoers
    ? partygoers.reduce((acc: { [key: string]: number }, value) => {
        acc[value.lastSeenIn] = (acc[value.lastSeenIn] || 0) + 1;
        return acc;
      }, {})
    : {};

  const modalHidden = useCallback(() => {
    setIsRoomModalOpen(false);
    if (user) {
      updateLocationData(user, campLocation);
    }
  }, [user, campLocation]);

  return (
    <div className="camp-container container-fluid">
      <div className="small-right-margin">
        <PartyTitle
          startUtcSeconds={BURN_START_UTC_SECONDS}
          withCountDown={false}
        />
      </div>
      {partygoers && (
        <div className="col">
          <UserList users={partygoers} imageSize={50} disableSeeAll={false} />
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
        <div className="col-5 chat-wrapper">
          <Chatbox />
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
        <InformationLeftColumn venueLogoPath={"ambulance"}>
          <InformationCard title="Call the Sparkle Fairies">
            <p className="title-sidebar">{`It's ok to need help!`}</p>
            <p className="short-description-sidebar">
              {`Sparkle Fairies (also knows as "reality rangers") are here to help if you need us. Whether you're feeling down, need a hug, have an issue with someone at the burn or taken too much of something, we're here to help.`}
            </p>
            <p>{`We're discreet, loving and here for you!`}</p>
            <a
              href="https://www.theguardian.com"
              rel="noopener noreferrer"
              target="_blank"
              className="link-button"
            >
              Go to private zoom
            </a>
          </InformationCard>
        </InformationLeftColumn>
      </div>
    </div>
  );
};

export default Camp;
