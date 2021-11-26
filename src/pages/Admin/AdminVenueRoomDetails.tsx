import React, { useMemo } from "react";
import { Link, useHistory } from "react-router-dom";
import Bugsnag from "@bugsnag/js";

import {
  ADMIN_V1_ROOMS_BASE_URL,
  ADMIN_V1_ROOT_URL,
  ROOM_TAXON,
} from "settings";

import { upsertRoom } from "api/admin";

import { Room, RoomInput } from "types/rooms";
import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";

import { useFirestoreConnect } from "hooks/useFirestoreConnect";
import { useSelector } from "hooks/useSelector";
import { useUser } from "hooks/useUser";

import { Toggler } from "components/atoms/Toggler";

import VenueEventDetails from "./VenueEventDetails";

import "./Admin.scss";

interface Props {
  index: number;
  venue: WithId<AnyVenue>;
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
  // @debt replace this with useVenueEvents or similar?
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

  const filteredEvents = useMemo(() => {
    if (!events) return;

    return events.filter((event) => event.room === room.title);
  }, [events, room.title]);

  const { user } = useUser();
  const history = useHistory();

  // @debt refactor this to use useAsync / useAsyncFn or similar
  const updateRoom = async (newState: boolean) => {
    if (!user) return;

    try {
      const roomValues: RoomInput = {
        ...room,
        isEnabled: newState,
      };

      await upsertRoom(roomValues, venue.id, user, index);

      history.push(`${ADMIN_V1_ROOT_URL}/${venue.slug}`);
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
                  alt={`${ROOM_TAXON.lower} icon`}
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
                      to={`${ADMIN_V1_ROOMS_BASE_URL}/${venue.id}?roomIndex=${index}`}
                      className="btn btn-block"
                    >
                      Edit {ROOM_TAXON.capital}
                    </Link>
                  }
                </div>
                <div className="toggle-room">
                  {/* @debt the onChange handler here should be useCallback'd */}
                  <Toggler
                    name={"toggle-" + index}
                    toggled={room.isEnabled}
                    onChange={() => {
                      updateRoom(!room.isEnabled);
                    }}
                    label={
                      room.isEnabled
                        ? `Turn ${ROOM_TAXON.lower} Off`
                        : `Turn ${ROOM_TAXON.lower} On`
                    }
                  />
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
                      containerClassName="admin-room-list-events"
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
