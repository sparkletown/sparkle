import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useFirebase } from "react-redux-firebase";

import Room from "../components/Room";

const ROOM_NAME = "jazz-backstage";

const Backstage = () => {
  return <Room roomName={ROOM_NAME} />;
};

export default Backstage;
