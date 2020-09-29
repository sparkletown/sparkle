import React from "react";
import { CampRoomData } from "types/CampRoomData";

interface Props {
  room: CampRoomData | undefined;
}

export const AdminVenueRoomDetails: React.FC<Props> = ({ room }) => {
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
            <div className="heading-group">
              <div style={{ padding: "5px" }}>
                <span className="content">
                  <a href={room.url}>{room.url}</a>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
