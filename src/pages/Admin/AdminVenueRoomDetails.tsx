import React, { useEffect, useState } from "react";
import { CampRoomData } from "types/CampRoomData";
import { Link, useHistory } from "react-router-dom";
import { Venue } from "types/Venue";
import { WithId } from "utils/id";
import "./Admin.scss";
import { RoomInput, upsertRoom } from "api/admin";
import { useUser } from "hooks/useUser";

interface Props {
  index: number;
  venue: WithId<Venue>;
  room: CampRoomData;
}

export const AdminVenueRoomDetails: React.FC<Props> = ({
  index,
  venue,
  room,
}) => {
  const [roomEnabled, setRoomEnabled] = useState(room?.isEnabled);
  const { user } = useUser();
  const history = useHistory();

  const updateUser = async (newState: boolean) => {
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
        <div className="venue-preview">
          <div>
            <h4
              className="italic"
              style={{ textAlign: "center", fontSize: "30px" }}
            >
              {room.title}
            </h4>
            <div className="heading-options">
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
                      updateUser(!roomEnabled);
                    }}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>
            <div className="heading-group">
              <div style={{ padding: "5px" }}>
                <span className="content">
                  <a href={room.url}>{room.url}</a>
                </span>
              </div>
            </div>
            <div className="content-group"></div>
          </div>
        </div>
      )}
    </div>
  );
};
