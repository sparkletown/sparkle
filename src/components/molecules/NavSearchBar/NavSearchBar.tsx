import { useSelector } from "hooks/useSelector";
import React, { useEffect, useState } from "react";
import { CampRoomData } from "types/CampRoomData";
import { User } from "types/User";
import { VenueEvent } from "types/VenueEvent";
import "./NavSearchBar.scss";

interface SearchResult {
  rooms: CampRoomData[];
  users: User[];
  events: VenueEvent[];
}

const NavSearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<SearchResult>({
    rooms: [],
    users: [],
    events: [],
  });

  const { venue, partygoers, venueEvents } = useSelector((state) => ({
    venue: state.firestore.data.currentVenue,
    partygoers: state.firestore.data.partygoers,
    venueEvents: state.firestore.data.venueEvents,
  }));

  useEffect(() => {
    if (!searchQuery) {
      setSearchResult({
        rooms: [],
        users: [],
        events: [],
      });
      return;
    }
    const filteredPartygoers = partygoers
      ? Object.values(partygoers).filter((partygoer) =>
          partygoer.partyName?.includes(searchQuery)
        )
      : [];
    const filteredEvents = venueEvents
      ? Object.values(venueEvents).filter((event) =>
          event.name.includes(searchQuery)
        )
      : [];
    const filteredRooms =
      venue && venue.rooms
        ? (venue?.rooms as CampRoomData[]).filter((room) =>
            room.title.includes(searchQuery)
          )
        : [];
    setSearchResult({
      rooms: filteredRooms,
      users: filteredPartygoers,
      events: filteredEvents,
    });
  }, [partygoers, searchQuery, venue, venueEvents]);

  const numberOfSearchResults =
    searchResult.rooms.length +
    searchResult.events.length +
    searchResult.users.length;

  return (
    <div className="nav-search-links">
      <div className="nav-search-icon" />
      <input
        className="nav-search-input"
        type="text"
        name=""
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search for people, rooms, events..."
      ></input>
      {!!searchQuery && (
        <div
          className="nav-search-close-icon"
          onClick={() => setSearchQuery("")}
        />
      )}
      {!!numberOfSearchResults && (
        <>
          <div className="nav-search-results">
            <div className="nav-search-result-number">
              <b>{numberOfSearchResults}</b> search results
            </div>
            {searchResult.rooms.map((room, index) => {
              return (
                <div className="row" key={`room-${index}`}>
                  <div
                    className="result-avatar"
                    style={{
                      backgroundImage: `url(${room.image_url})`,
                    }}
                  ></div>
                  <div className="result-info">
                    <div className="result-title">{room.title}</div>
                    <div>Room</div>
                  </div>
                </div>
              );
            })}
            {searchResult.events.map((event, index) => {
              return (
                <div className="row" key={`event-${index}`}>
                  <div>
                    <div>{event.name}</div>
                    <div>Event</div>
                  </div>
                </div>
              );
            })}
            {searchResult.users.map((user, index) => {
              return <div key={`user-${index}`}>{user.partyName}</div>;
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default NavSearchBar;
