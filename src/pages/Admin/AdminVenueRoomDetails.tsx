import React from "react";
import { Link, useHistory } from "react-router-dom";
import Bugsnag from "@bugsnag/js";

import { Venue } from "types/venues";
import { Room } from "types/rooms";
import { WithId } from "utils/id";

import { RoomInput, upsertRoom } from "api/admin";
import { useUser } from "hooks/useUser";
import { useSelector } from "hooks/useSelector";
import { useFirestoreConnect } from "hooks/useFirestoreConnect";

import VenueEventDetails from "./VenueEventDetails";

import "./Admin.scss";

interface Props {
  index: number;
  venue: WithId<Venue>;
  room: Room;
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

  const filteredEvents =
    events &&
    events.filter((e) => {
      if (e.room === room.title) {
        return e;
      }
      return null;
    });

  const { user } = useUser();
  const history = useHistory();

  const updateRoom = async (newState: boolean) => {
    if (!user) return;
    try {
      await upsertRoom(
        { ...(room as RoomInput), isEnabled: newState },
        venue.id,
        user,
        index
      );
      history.push(`/admin/${venue.id}`);
    } catch (e) {
      Bugsnag.notify(e, (event) => {
        event.addMetadata("AdminVenueRoomDetails::updateRoom", {
          venueId: venue.id,
          roomIndex: index,
          newState,
        });
      });
    }
  };

  return (
    <div>
      {room && (
        <div
          className={
            room.isEnabled
              ? "venue-room-details"
              : "venue-room-details room-disabled"
          }
        >
          <div>
            <div className="heading-options">
              <div className="banner">
                <img
                  className="banner-image"
                  src={room.image_url}
                  alt="room icon"
                />
              </div>
              <div>
                <h4>{room.title}</h4>
                <div>
                  <span>subtitle:</span>
                  <span>{room.subtitle}</span>
                </div>
              </div>
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
                      checked={room.isEnabled}
                      onClick={() => {
                        updateRoom(!room.isEnabled);
                      }}
                    />
                    <span className="slider round"></span>
                  </label>
                  <div>Turn room {room.isEnabled ? "Off" : "On"}</div>
                </div>
              </div>
            </div>
            <div className="venue-content">
              <div className="sub-content">
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
            <a
              href="?"
              className="btn btn-small"
              onClick={(e) => {
                e.preventDefault();
                setShowCreateEventModal(true, room.title);
              }}
            >
              Add an Event
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
