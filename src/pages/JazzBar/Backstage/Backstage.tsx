import React from "react";

import Room from "../components/Room";

const ROOM_NAME = "jazz-backstage";

const Backstage = () => {
  return (
    <div className="backstage">
      <div className="wrapper">
        <Room roomName={ROOM_NAME} />
      </div>
    </div>
  );
};

export default Backstage;
