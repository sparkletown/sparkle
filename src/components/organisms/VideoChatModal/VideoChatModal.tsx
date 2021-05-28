import { useConnectVideoRooms } from "hooks/useConnectVideoRooms";
import React from "react";

export const VideoChatModal: React.FC = () => {
  const asd = useConnectVideoRooms();

  console.log("VideoChatModal:", asd);
  return <div></div>;
};
