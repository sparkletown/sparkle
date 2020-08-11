import React, { useState } from "react";

import CountDown from "components/molecules/CountDown";
import UserList from "components/molecules/UserList";
import Chatbox from "components/organisms/Chatbox";
import RoomList from "./components/RoomList";
import WithNavigationBar from "components/organisms/WithNavigationBar";
import { updateTheme } from "pages/VenuePage/helpers";
import useUpdateLocationEffect, {
  updateLocationData,
} from "utils/useLocationUpdateEffect";
import useConnectPartyGoers from "hooks/useConnectPartyGoers";
import useConnectCurrentVenue from "hooks/useConnectCurrentVenue";

import { Map, PartyTitle } from "./components";
import { useUser } from "hooks/useUser";
import { useSelector } from "hooks/useSelector";
import { isPartyMapVenue, PartyMapEvent } from "types/PartyMapVenue";
import RoomModal from "./RoomModal";
import useConnectCurrentEvent from "hooks/useConnectCurrentEvent";
import { WithId } from "utils/id";

const PartyMap = () => {
  useConnectPartyGoers();
  useConnectCurrentVenue();
  useConnectCurrentEvent();

  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<string>();

  const { user } = useUser();
  const { event, partygoers, venue, subVenues, childVenues } = useSelector(
    (state) => ({
      venue: state.firestore.ordered.currentVenue?.[0],
      event: state.firestore.ordered.currentEvent?.[0],
      subVenues: state.firestore.ordered.currentSubVenues ?? [],
      childVenues: state.firestore.ordered.currentChildVenues ?? [],
      partygoers: state.firestore.ordered.partygoers,
    })
  );

  useUpdateLocationEffect(user, "Map");

  venue && updateTheme(venue);

  const attendances = partygoers
    ? partygoers.reduce((acc: { [key: string]: number }, value) => {
        acc[value.lastSeenIn] = (acc[value.lastSeenIn] || 0) + 1;
        return acc;
      }, {})
    : {};

  const modalHidden = () => {
    setIsRoomModalOpen(false);
    if (user) {
      updateLocationData(user, "Map");
    }
  };

  const combinedAttendanceRoomTitles = [
    [
      "Bring Your Own Party: The Landfill",
      "Bring Your Own Party: Sedi Mental",
      "Bring Your Own Party: Meta More Peak",
    ],
    [
      "Dancing: Centre of Groovity",
      "Dancing: Techno-Tonics",
      "Dancing: Richter RPM",
    ],
  ];

  for (const roomTitles of combinedAttendanceRoomTitles) {
    let combinedAttendance = 0;
    for (const roomTitle of roomTitles) {
      if (roomTitle in attendances && attendances[roomTitle] !== undefined) {
        combinedAttendance += attendances[roomTitle];
      }
    }
    for (const roomTitle of roomTitles) {
      attendances[roomTitle] = combinedAttendance;
    }
  }

  if (!isPartyMapVenue(venue)) return null;

  return (
    <WithNavigationBar redirectionUrl={`/v/${venue.id}`}>
      <div className="container-fluid">
        <div className="small-right-margin">
          {event ? (
            <PartyTitle
              startUtcSeconds={event.start_utc_seconds}
              withCountDown={false}
            />
          ) : (
            <>No Event Currently Happening</>
          )}
        </div>
        {partygoers && (
          <div className="col">
            <UserList users={partygoers} imageSize={50} disableSeeAll={false} />
          </div>
        )}
        <div className="col">
          <div className="starting-indication">
            {venue.description.text}{" "}
            {venue.description.program_url && (
              <a
                href={venue.description.program_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Event Program here
              </a>
            )}
          </div>
          <CountDown startUtcSeconds={event?.start_utc_seconds} />
        </div>
        <div className="row">
          <Map
            venue={venue}
            subVenues={subVenues}
            attendances={attendances}
            setSelectedRoom={setSelectedRoom}
            setIsRoomModalOpen={setIsRoomModalOpen}
          />
        </div>
        <div className="row">
          <div className="col">
            <RoomList
              startUtcSeconds={event?.start_utc_seconds}
              subVenues={subVenues}
              childVenues={childVenues}
              attendances={attendances}
              setSelectedRoom={setSelectedRoom}
              setIsRoomModalOpen={setIsRoomModalOpen}
              currentEvent={event}
            />
          </div>
          <div className="col-5 chat-wrapper">{/* <Chatbox /> */}</div>
        </div>
      </div>
      <RoomModal
        show={isRoomModalOpen}
        venue={childVenues.find((v) => v.id === selectedRoom)}
        onHide={modalHidden}
      />
    </WithNavigationBar>
  );
};

export default PartyMap;
