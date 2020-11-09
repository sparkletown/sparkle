import React, { useState, useCallback, useEffect } from "react";
import useConnectPartyGoers from "hooks/useConnectPartyGoers";
import { useSelector } from "hooks/useSelector";
import { LOC_UPDATE_FREQ_MS } from "settings";
import { IS_BURN } from "secrets";
import UserList from "components/molecules/UserList";
import { CampRoomData } from "types/CampRoomData";
import CountDown from "components/molecules/CountDown";
import { Map } from "./components/Map";
import { RoomList } from "./components/RoomList";
import { RoomModal } from "./components/RoomModal";
import { CampVenue } from "types/CampVenue";
import ChatDrawer from "components/organisms/ChatDrawer";
import SparkleFairiesPopUp from "components/molecules/SparkleFairiesPopUp/SparkleFairiesPopUp";
import { useParams } from "react-router-dom";
import { InfoDrawer } from "components/molecules/InfoDrawer/InfoDrawer";
import { Modal } from "react-bootstrap";
import { SchedulePageModal } from "components/organisms/SchedulePageModal/SchedulePageModal";
import { createUrlSafeName } from "api/admin";

import "./Camp.scss";
import BannerMessage from "components/molecules/BannerMessage";

const Camp: React.FC = () => {
  useConnectPartyGoers();
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<CampRoomData | undefined>();
  const [showEventSchedule, setShowEventSchedule] = useState(false);
  const [nowMs, setNowMs] = useState(new Date().getTime());

  const { partygoers, venue } = useSelector((state) => ({
    venue: state.firestore.ordered.currentVenue?.[0] as CampVenue,
    partygoers: state.firestore.ordered.partygoers,
  }));

  useEffect(() => {
    const interval = setInterval(() => {
      setNowMs(new Date().getTime());
    }, LOC_UPDATE_FREQ_MS);

    return () => clearInterval(interval);
  }, [setNowMs]);

  const usersInCamp = partygoers
    ? partygoers.filter(
        (partygoer) =>
          partygoer?.lastSeenIn &&
          partygoer?.lastSeenIn[venue.name] >
            (nowMs - LOC_UPDATE_FREQ_MS * 2) / 1000
      )
    : [];

  const attendances = usersInCamp
    ? usersInCamp.reduce<Record<string, number>>((acc, value) => {
        Object.keys(value.lastSeenIn).forEach((key) => {
          acc[key] = (acc[key] || 0) + 1;
        });
        return acc;
      }, {})
    : {};

  const modalHidden = useCallback(() => {
    setIsRoomModalOpen(false);
  }, []);

  const { roomTitle } = useParams();

  useEffect(() => {
    if (roomTitle) {
      const campRoom = venue?.rooms.find(
        (room) => createUrlSafeName(room.title) === createUrlSafeName(roomTitle)
      );
      if (campRoom) {
        setSelectedRoom(campRoom);
        setIsRoomModalOpen(true);
      }
    }
  }, [roomTitle, setIsRoomModalOpen, setSelectedRoom, venue]);

  return (
    <>
      <BannerMessage venue={venue} />
      <div className="camp-container">
        <div className="row">
          {usersInCamp && (
            <div className="col">
              <UserList
                users={usersInCamp}
                imageSize={50}
                disableSeeAll={false}
                isCamp={true}
                activity={venue.activity ?? "partying"}
              />
            </div>
          )}
        </div>
        <div className="row">
          <div className="col">
            <div className="starting-indication">
              {venue.description?.text}{" "}
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
            {venue.start_utc_seconds && (
              <CountDown
                startUtcSeconds={venue.start_utc_seconds}
                textBeforeCountdown="Party begins in"
              />
            )}
          </div>
        </div>
        <Map
          venue={venue}
          partygoers={usersInCamp}
          attendances={attendances}
          selectedRoom={selectedRoom}
          setSelectedRoom={setSelectedRoom}
          setIsRoomModalOpen={setIsRoomModalOpen}
        />
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
          joinButtonText={venue.joinButtonText}
        />
        {(IS_BURN || venue.showChat) && (
          <div className="chat-pop-up" style={{ zIndex: 100 }}>
            <ChatDrawer
              roomName={venue.name}
              title={`${venue.name} Chat`}
              chatInputPlaceholder="Chat"
            />
          </div>
        )}
        {IS_BURN && (
          <div className="sparkle-fairies">
            <SparkleFairiesPopUp setShowEventSchedule={setShowEventSchedule} />
          </div>
        )}
        <div className="info-drawer-camp">
          <InfoDrawer venue={venue} />
        </div>
        <Modal
          show={showEventSchedule}
          onHide={() => setShowEventSchedule(false)}
          dialogClassName="custom-dialog"
        >
          <Modal.Body>
            <SchedulePageModal />
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};

export default Camp;
