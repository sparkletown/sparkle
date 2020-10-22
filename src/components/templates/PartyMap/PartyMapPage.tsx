import React, { useEffect, useState } from "react";

import CountDown from "components/molecules/CountDown";
import UserList from "components/molecules/UserList";
import RoomList from "./components/RoomList";
import WithNavigationBar from "components/organisms/WithNavigationBar";
import { updateTheme } from "pages/VenuePage/helpers";
import { updateLocationData } from "utils/useLocationUpdateEffect";
import useConnectPartyGoers from "hooks/useConnectPartyGoers";
import useConnectCurrentVenue from "hooks/useConnectCurrentVenue";

import { PartyTitle } from "./components";
import { useUser } from "hooks/useUser";
import { useSelector } from "hooks/useSelector";
import { isPartyMapVenue } from "types/PartyMapVenue";
import { RoomData } from "types/RoomData";
import RoomModal from "./RoomModal";
import { venueLandingUrl } from "utils/url";
import { Map } from "./components/Map/Map";
import { currentTimeInUnixEpoch } from "utils/time";
import { LOC_UPDATE_FREQ_MS } from "settings";

const PartyMap = () => {
  useConnectPartyGoers();
  useConnectCurrentVenue();

  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomData>();
  const [nowMs, setNowMs] = useState(new Date().getTime());

  const { user, profile } = useUser();
  const { partygoers, venue } = useSelector((state) => ({
    venue: state.firestore.ordered.currentVenue?.[0],
    partygoers: state.firestore.ordered.partygoers,
  }));

  venue && updateTheme(venue);

  useEffect(() => {
    const interval = setInterval(() => {
      setNowMs(new Date().getTime());
    }, LOC_UPDATE_FREQ_MS);

    return () => clearInterval(interval);
  }, [setNowMs]);

  const usersInVenue = partygoers
    ? partygoers.filter(
        (partygoer) =>
          partygoer.lastSeenIn[venue.name] >
          (nowMs - LOC_UPDATE_FREQ_MS * 2) / 1000
      )
    : [];

  const attendances = usersInVenue
    ? usersInVenue.reduce<Record<string, number>>((acc, value) => {
        Object.keys(value.lastSeenIn).forEach((key) => {
          acc[key] = (acc[key] || 0) + 1;
        });
        return acc;
      }, {})
    : {};

  const modalHidden = () => {
    setIsRoomModalOpen(false);
    if (user) {
      updateLocationData(
        user,
        { Map: currentTimeInUnixEpoch },
        profile?.lastSeenIn
      );
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
    <WithNavigationBar redirectionUrl={venueLandingUrl(venue.id)}>
      <div className="container-fluid">
        <div className="small-right-margin">
          <PartyTitle
            startUtcSeconds={venue.start_utc_seconds}
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
          <CountDown startUtcSeconds={venue.start_utc_seconds} />
        </div>
        <div className="row">
          <Map
            config={venue}
            attendances={attendances}
            setSelectedRoom={setSelectedRoom}
            setIsRoomModalOpen={setIsRoomModalOpen}
          />
        </div>
        <div className="row">
          <div className="col">
            <RoomList
              startUtcSeconds={venue.start_utc_seconds}
              rooms={venue.rooms}
              attendances={attendances}
              setSelectedRoom={setSelectedRoom}
              setIsRoomModalOpen={setIsRoomModalOpen}
            />
          </div>
        </div>
      </div>
      <RoomModal
        show={isRoomModalOpen}
        room={selectedRoom}
        onHide={modalHidden}
      />
    </WithNavigationBar>
  );
};

export default PartyMap;
