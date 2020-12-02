import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";

import { RootState } from "index";
import { createUrlSafeName } from "api/admin";

import { PartyMapVenue } from "types/PartyMapVenue";
import { PartyMapRoomData } from "types/RoomData";

import { useVenueRecentPartygoers } from "hooks/useVenueRecentPartygoers";
import { useSelector } from "hooks/useSelector";

import { Map, RoomModal } from "./components";

import AnnouncementMessage from "components/molecules/AnnouncementMessage/AnnouncementMessage";
import SparkleFairiesPopUp from "components/molecules/SparkleFairiesPopUp/SparkleFairiesPopUp";

import "./PartyMap.scss";

const partyMapVenueSelector = (state: RootState) =>
  state.firestore.ordered.currentVenue?.[0] as PartyMapVenue;

export const PartyMap: React.FC = () => {
  const currentVenue = useSelector(partyMapVenueSelector);

  // TODO: can we just make this a boolean that is set from isTruthy(selectedRoom)?
  const [isRoomModalOpen, setRoomModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<
    PartyMapRoomData | undefined
  >();

  const selectRoom = useCallback((room: PartyMapRoomData) => {
    setSelectedRoom(room);
    setRoomModalOpen(true);
  }, []);

  const unselectRoom = useCallback(() => {
    // TODO: should we rework this so we only unselect if it matches? To prevent race conditions?
    // setRoomClicked((prevRoomClicked) =>
    //   prevRoomClicked === room.title ? undefined : room.title
    // );
    setSelectedRoom(undefined);
    setRoomModalOpen(false);
  }, []);

  // TODO: can we get rid of this in favour of unselectRoom?
  const closeRoomModal = useCallback(() => {
    setRoomModalOpen(false);
  }, []);

  // Find current room from url
  const { roomTitle } = useParams();
  const currentRoom = useMemo(() => {
    if (!currentVenue || !roomTitle) return;

    return currentVenue.rooms.find(
      (venueRoom) =>
        createUrlSafeName(venueRoom.title) === createUrlSafeName(roomTitle)
    );
  }, [currentVenue, roomTitle]);

  useEffect(() => {
    if (currentRoom) {
      selectRoom(currentRoom);
    }
  }, [currentRoom, selectRoom]);

  // TODO: do we need/want to calculate this on the frontend? Or can we do it in a function/similar serverside?
  const usersInVenue = useVenueRecentPartygoers(currentVenue.name);

  // TODO: do we need this?
  // const [showEventSchedule, setShowEventSchedule] = useState(false);

  return (
    <>
      <div className="party-venue-container">
        <AnnouncementMessage message={currentVenue.bannerMessage} />

        {/* TODO: should this still be here on the partymap? */}
        {/*{usersInCamp && (*/}
        {/*  <div className="row">*/}
        {/*    <div className="col">*/}
        {/*      <UserList*/}
        {/*        users={usersInCamp}*/}
        {/*        imageSize={50}*/}
        {/*        disableSeeAll={false}*/}
        {/*        isCamp={true}*/}
        {/*        activity={currentVenue.activity ?? "partying"}*/}
        {/*      />*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*)}*/}

        {/* TODO: should this still be here on the partymap? */}
        {/*<div className="row">*/}
        {/*  <div className="col">*/}
        {/*    <div className="starting-indication">*/}
        {/*      {venue.description?.text}{" "}*/}
        {/*      {venue.description?.program_url && (*/}
        {/*          <a*/}
        {/*              href={venue.description.program_url}*/}
        {/*              target="_blank"*/}
        {/*              rel="noopener noreferrer"*/}
        {/*          >*/}
        {/*            Event Program here*/}
        {/*          </a>*/}
        {/*      )}*/}
        {/*    </div>*/}
        {/*    {venue.start_utc_seconds && (*/}
        {/*        <CountDown*/}
        {/*            startUtcSeconds={venue.start_utc_seconds}*/}
        {/*            textBeforeCountdown="Party begins in"*/}
        {/*        />*/}
        {/*    )}*/}
        {/*  </div>*/}
        {/*</div>*/}

        <Map
          venue={currentVenue}
          partygoers={usersInVenue}
          selectedRoom={selectedRoom}
          selectRoom={selectRoom}
          unselectRoom={unselectRoom}
        />

        {/* TODO: should this still be here on the partymap? */}
        {/*<div className="row">*/}
        {/*  <div className="col">*/}
        {/*    <RoomList*/}
        {/*        rooms={venue.rooms}*/}
        {/*        attendances={attendances}*/}
        {/*        setSelectedRoom={setSelectedRoom}*/}
        {/*        setIsRoomModalOpen={setIsRoomModalOpen}*/}
        {/*    />*/}
        {/*  </div>*/}
        {/*</div>*/}

        <RoomModal
          show={isRoomModalOpen}
          room={selectedRoom}
          onHide={closeRoomModal}
          // joinButtonText={currentVenue.joinButtonText} // TODO: this existed on Camp, is it just a deficiency in our types that it doesn't exist on  PartyMapVenue?
        />

        {/* TODO: should this still be here on the partymap? */}
        {/*{(IS_BURN || currentVenue.showChat) && (*/}
        {/*    <div className="chat-pop-up" style={{ zIndex: 100 }}>*/}
        {/*      <ChatDrawer*/}
        {/*          roomName={currentVenue.name}*/}
        {/*          title={`${currentVenue.name} Chat`}*/}
        {/*          chatInputPlaceholder="Chat"*/}
        {/*      />*/}
        {/*    </div>*/}
        {/*)}*/}

        {currentVenue?.config?.showRangers && (
          <div className="sparkle-fairies">
            <SparkleFairiesPopUp />
          </div>
        )}

        {/* TODO: should this still be here on the partymap? */}
        {/*<div className="info-drawer-camp">*/}
        {/*  <InfoDrawer venue={currentVenue} />*/}
        {/*</div>*/}

        {/* TODO: should this still be here on the partymap? */}
        {/*<Modal*/}
        {/*    show={showEventSchedule}*/}
        {/*    onHide={() => setShowEventSchedule(false)}*/}
        {/*    dialogClassName="custom-dialog"*/}
        {/*>*/}
        {/*  <Modal.Body>*/}
        {/*    <SchedulePageModal />*/}
        {/*  </Modal.Body>*/}
        {/*</Modal>*/}
      </div>
    </>
  );
};

export default PartyMap;
