import React from "react";

import Room from "../components/Room";
import "./Cocktail.scss";

const ROOM_NAME = "jazz-backstage";

const Backstage = () => {
  return (
    <div className="cocktail">
      <div className="wrapper">
        <Room roomName={ROOM_NAME} />
      </div>
    </div>
  );
};

export default Backstage;
