import React from "react";
import { CampRoomData } from "types/CampRoomData";
import { Link } from "react-router-dom";
import { Venue } from "types/Venue";
import { WithId } from "utils/id";
import "./Admin.scss";

interface Props {
  index: number;
  venue: WithId<Venue>;
  room: CampRoomData | undefined;
}

export const AdminVenueRoomDetails: React.FC<Props> = ({
  index,
  venue,
  room,
}) => {
  console.log(index);
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
