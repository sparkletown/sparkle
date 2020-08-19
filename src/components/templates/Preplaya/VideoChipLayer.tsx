import React, { useEffect } from "react";
import { WS_RELAY_URL, JITSI_URL, JITSI_ROOM_NAME } from "secrets";
import WebSocket from "ws";
import JitsiMeetJS from "lib-jitsi-meet";
import { useUser } from "hooks/useUser";

// Trouble connecting? Run a local relay:
// git clone git@github.com:sparkletown/sparkle-relay && cd sparkle-relay && docker-compose up
const DEFAULT_WS_RELAY_URL = "wss://localhost:8080/";

// Trouble connecting? Make a local Jitsi:
// https://jitsi.github.io/handbook/docs/devops-guide/devops-guide-docker
// https://github.com/jitsi/docker-jitsi-meet/issues/425
const DEFAULT_JITSI_URL = "wss://localhost:6443/xmpp-websocket";
const DEFAULT_JITSI_ROOM_NAME = "playa-local";

interface PropsType {}

const VideoChipLayer: React.FunctionComponent<PropsType> = () => {
  const { user } = useUser();

  useEffect(() => {
    const ws = new WebSocket(WS_RELAY_URL || DEFAULT_WS_RELAY_URL, {
      origin: window.location.href.split("?")[0],
    });

    ws.on("open", function open() {
      console.log("connected");
      ws.send(Date.now());
    });

    ws.on("close", function close() {
      console.log("disconnected");
    });

    ws.on("message", function incoming(data) {
      console.log(
        `Roundtrip time: ${Date.now() - parseInt(data.toString())} ms`
      );

      setTimeout(function timeout() {
        ws.send(Date.now());
      }, 500);
    });
  });

  useEffect(() => {
    const connection = JitsiMeetJS.JitsiConnection(null, null, {
      serviceUrl: JITSI_URL || DEFAULT_JITSI_URL,
    });

    connection.addEventListener(
      JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED,
      () => {
        const name = JITSI_ROOM_NAME || DEFAULT_JITSI_ROOM_NAME;
        const room = connection.initJitsiConference(name, {
          openBridgeChannel: true,
        });
        room.setDisplayName(user?.uid);
      }
    );
  });

  return <>TO BE IMPLEMENTED</>;
};

export default VideoChipLayer;
