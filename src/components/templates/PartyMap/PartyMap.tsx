import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";

import { RootState } from "index";
import { createUrlSafeName } from "api/admin";

import { Room } from "types/rooms";
import { PartyMapVenue } from "types/venues";

import { useSelector } from "hooks/useSelector";
import { useUser } from "hooks/useUser";
import { usePartygoers } from "hooks/users";

import { orderedVenuesSelector } from "utils/selectors";
import { getCurrentTimeInUTCSeconds } from "utils/time";
import { openRoomUrl } from "utils/url";
import { trackRoomEntered } from "utils/useLocationUpdateEffect";

import { Map, RoomModal } from "./components";

import AnnouncementMessage from "components/molecules/AnnouncementMessage/AnnouncementMessage";
import SparkleFairiesPopUp from "components/molecules/SparkleFairiesPopUp/SparkleFairiesPopUp";

import "./PartyMap.scss";

const partyMapVenueSelector = (state: RootState) =>
  state.firestore.ordered.currentVenue?.[0] as PartyMapVenue;

export const PartyMap: React.FC = () => {
  const { user, profile } = useUser();
  const currentVenue = useSelector(partyMapVenueSelector);
  const venues = useSelector(orderedVenuesSelector);

  // TODO: can we just make this a boolean that is set from isTruthy(selectedRoom)?
  const [isRoomModalOpen, setRoomModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | undefined>();

  const selectRoom = useCallback((room: Room) => {
    setSelectedRoom(room);
    setRoomModalOpen(true);
  }, []);

  const unselectRoom = useCallback(() => {
    setSelectedRoom(undefined);
    setRoomModalOpen(false);
  }, []);

  // TODO: extract this into a reusable hook/similar
  const enterRoom = useCallback(
    (room: Room) => {
      if (!room || !user) return;

      // TODO: we could process this once to make it look uppable directly? What does the data key of venues look like?
      const roomVenue = venues?.find((venue) =>
        room.url.endsWith(`/${venue.id}`)
      );

      const nowInUTCSeconds = getCurrentTimeInUTCSeconds();

      const roomName = {
        [`${currentVenue.name}/${room.title}`]: nowInUTCSeconds,
        ...(roomVenue ? { [currentVenue.name]: nowInUTCSeconds } : {}),
      };

      trackRoomEntered(user, roomName, profile?.lastSeenIn);
      openRoomUrl(room.url);
    },
    [profile, user, currentVenue, venues]
  );

  const enterSelectedRoom = useCallback(() => {
    if (!selectedRoom) return;

    enterRoom(selectedRoom);
  }, [enterRoom, selectedRoom]);

  // Find current room from url
  const { roomTitle } = useParams();
  const currentRoom = useMemo(() => {
    if (!currentVenue || !currentVenue.rooms || !roomTitle) return;

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
  // @debt We used to specify the explicit venue that we wanted the users for,
  //   but lost that functionality in #1042, so this may no longer be correct..
  const usersInVenue = usePartygoers();

  if (!user || !profile?.data) return <>Loading..</>;

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
          user={user}
          profileData={profile.data}
          venue={currentVenue}
          partygoers={usersInVenue}
          selectedRoom={selectedRoom}
          selectRoom={selectRoom}
          unselectRoom={unselectRoom}
          enterSelectedRoom={enterSelectedRoom}
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
          onHide={unselectRoom}
        />

        {currentVenue?.config?.showRangers && (
          <div className="sparkle-fairies">
            <SparkleFairiesPopUp />
          </div>
        )}
      </div>
    </>
  );
};

export default PartyMap;
