import React, { useMemo, useState } from "react";
import { CampRoomData } from "types/CampRoomData";
import { Link, useHistory } from "react-router-dom";
import { Venue } from "types/Venue";
import { WithId } from "utils/id";
import "./Admin.scss";
import { RoomInput, upsertRoom } from "api/admin";
import { useUser } from "hooks/useUser";
import { useSelector } from "hooks/useSelector";
import VenueEventDetails from "./VenueEventDetails";
import { useFirestoreConnect } from "react-redux-firebase";

interface Props {
  index: number;
  venue: WithId<Venue>;
  room: CampRoomData;
  setEditedEvent: Function | undefined;
  setShowCreateEventModal: Function;
  setShowDeleteEventModal: Function;
}

export const AdminVenueRoomDetails = ({
  index,
  venue,
  room,
  setEditedEvent,
  setShowCreateEventModal,
  setShowDeleteEventModal,
}: Props) => {
  useFirestoreConnect([
    {
      collection: "venues",
      doc: venue.id,
      subcollections: [{ collection: "events" }],
      orderBy: ["start_utc_seconds", "asc"],
      storeAs: "events",
    },
  ]);

  const events = useSelector((state) => state.firestore.ordered.events);

  const filteredEvents = useMemo(
    () =>
      events &&
      events.filter((e) => {
        if (e.room === room.title) {
          return e;
        }
        return null;
      }),
    [events, room]
  );

  const [roomEnabled, setRoomEnabled] = useState(room?.isEnabled);

  // const filteredEvents = events && events.filter((e) => {
  //   if (e.room === room.title) { return e; }
  //   return null
  // })
  const { user } = useUser();
  const history = useHistory();

  const updateRoom = async (newState: boolean) => {
    if (!user) return;
    try {
      setRoomEnabled(newState);
      await upsertRoom(
        { ...(room as RoomInput), isEnabled: newState },
        venue.id,
        user,
        index
      );
      history.push(`/admin/venue/${venue.id}`);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      {room && (
        <div className="venue-room-details">
          <div>
            <div className="heading-options">
              <h4>{room.title}</h4>
              <div className="room-options">
                <div className="edit-room">
                  {
                    <Link
                      to={`/admin/venue/rooms/${venue.id}?roomIndex=${index}`}
                      className="btn btn-block"
                    >
                      Edit Room
                    </Link>
                  }
                </div>
                <div className="toggle-room">
                  <label id={"toggle-" + index} className="switch">
                    <input
                      type="checkbox"
                      id={"toggle-" + index}
                      name={"toggle-" + index}
                      checked={roomEnabled}
                      onClick={() => {
                        updateRoom(!roomEnabled);
                      }}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
              </div>
            </div>
            <div className="venue-content">
              <div className="sub-content">
                <div>
                  <span>subtitle:</span>
                  <span>{room.subtitle}</span>
                </div>
                <div>
                  <span>About:</span>
                  <span>{room.about}</span>
                </div>
                <div>
                  <span>URL:</span>
                  <span>
                    <a href={room.url}>{room.url}</a>
                  </span>
                </div>
              </div>
              <div className="banner">
                <div>
                  <div>How your room will appear on the camp map</div>
                  <img
                    className="banner-image"
                    src={room.image_url}
                    alt="room icon"
                  />
                </div>
              </div>
            </div>
          </div>
          {filteredEvents && filteredEvents.length > 0 && (
            <>
              {filteredEvents.map((venueEvent) => {
                return (
                  <div className="rooms-events-list" key={venueEvent.id}>
                    <VenueEventDetails
                      venueEvent={venueEvent}
                      setEditedEvent={setEditedEvent}
                      setShowCreateEventModal={setShowCreateEventModal}
                      setShowDeleteEventModal={setShowDeleteEventModal}
                      className="admin-room-list-events"
                    />
                  </div>
                );
              })}
            </>
          )}
          <div className="page-container-adminpanel-actions">
            <button
              className="btn btn-primary"
              onClick={() => setShowCreateEventModal(true)}
            >
              Create an Event
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
