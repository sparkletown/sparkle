import React from "react";
import { useSelector } from "react-redux";
import { User as FUser } from "firebase";

import CountDown from "components/molecules/CountDown";
import UserList from "components/molecules/UserList";
import Chatbox from "components/organisms/Chatbox";
import RoomList from "../components/RoomList";
import WithNavigationBar from "components/organisms/WithNavigationBar";
import { User } from "types/User";
import useUpdateLocationEffect from "utils/useLocationUpdateEffect";

import { Map, PartyTitle } from "../components";
import { PartyMapVenue } from "../types";

import "./PartyMapPage.scss";

const PartyMapPage = () => {
  const { partygoers, user, venue } = useSelector((state: any) => ({
    venue: state.firestore.data.currentVenue,
    user: state.user,
    partygoers: state.firestore.ordered.partygoers,
  })) as { partygoers: User[]; user: FUser; venue: PartyMapVenue };

  useUpdateLocationEffect(user, "Map");

  const attendances = partygoers
    ? partygoers.reduce((acc: { [key: string]: number }, value) => {
        acc[value.lastSeenIn] = (acc[value.lastSeenIn] || 0) + 1;
        return acc;
      }, {})
    : {};

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

  return (
    <WithNavigationBar>
      <div className="container">
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
          <Map config={venue} attendances={attendances} />
        </div>
        <div className="row">
          <div className="col">
            <RoomList
              startUtcSeconds={venue.start_utc_seconds}
              rooms={venue.rooms}
              attendances={attendances}
            />
          </div>
          <div className="col-5 chat-wrapper">
            <Chatbox />
          </div>
        </div>
      </div>
    </WithNavigationBar>
  );
};

export default PartyMapPage;
