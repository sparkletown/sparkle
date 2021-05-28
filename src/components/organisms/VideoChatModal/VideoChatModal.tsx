import { useConnectVideoRooms } from "hooks/useConnectVideoRooms";
import React from "react";

export const VideoChatModal: React.FC = () => {
  const videoRoomRequests = useConnectVideoRooms();

  console.log("VideoChatModal:", videoRoomRequests);
  return <div></div>;
};
