import React from "react";

import Room from "../components/Room";
import "./Cocktail.scss";

const ROOM_NAME = "jazz-backstage";

const Cocktail = () => {
  return (
    <div className="cocktail">
      <div className="wrapper">
        <Room roomName={ROOM_NAME} />
      </div>
    </div>
  );
};

export default Cocktail;
