import React from "react";
import TableComponent from "../../../../molecules/TableComponent";
import { useRecentVenueUsers } from "../../../../../hooks/users";
import "./Audience.scss";

const Audience = () => {
  const { recentVenueUsers } = useRecentVenueUsers();

  return (
    <div className="screenshare-audience">
      <TableComponent
        table={{
          capacity: 240,
          title: "",
          reference: "table-1",
          rows: 8,
          columns: 31,
        }}
        emptySeatSize={30}
        experienceName="smth"
        nameOfVideoRoom="screenshare"
        onJoinClicked={() => {}}
        tableLocked={() => false}
        users={recentVenueUsers}
      />
    </div>
  );
};

export default Audience;
