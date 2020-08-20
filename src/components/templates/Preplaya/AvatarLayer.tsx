import React, { useEffect, useState, useRef } from "react";
import { WS_RELAY_URL, JITSI_ROOM_NAME } from "secrets";
import $ from "jquery";
import "strophe.js";
import "strophejs-plugin-disco";
import "strophejs-plugin-caps";
import JitsiMeetJS from "lib-jitsi-meet";
import { useUser } from "hooks/useUser";
import {
  UserStateMap,
  HelloWsMessage,
  MessageType,
  BroadcastMessage,
} from "types/RelayMessage";
import { DEFAULT_JITSI_ROOM_NAME, DEFAULT_WS_RELAY_URL } from "settings";

(window as any).jQuery = (window as any).$ = $;

interface PropsType {}

type SendFunc = (data: any, cb?: (err?: Error) => void) => void;

const AvatarLayer: React.FunctionComponent<PropsType> = () => {
  const { user } = useUser();
  const [userStateMap, setUserStateMap] = useState<UserStateMap>({});
  const userStateMapRef = useRef(userStateMap);
  const wsSend = useRef<SendFunc>();

  useEffect(() => {
    if (!user) return;

    const ws = new WebSocket(WS_RELAY_URL || DEFAULT_WS_RELAY_URL);

    ws.onopen = () => {
      const hello: HelloWsMessage = {
        type: MessageType.Hello,
        uid: user.uid,
      };
      ws.send(JSON.stringify(hello));
      wsSend.current = ws.send;
    };

    ws.onclose = () => {
      wsSend.current = undefined;
    };

    ws.onmessage = (data) => {
      try {
        const update = JSON.parse(data.data.toString()) as BroadcastMessage;
        const newUserStateMap = { ...userStateMapRef.current };
        for (const uid of Object.keys(update.updates)) {
          console.log("setting uid", uid, "to", update.updates[uid]);
          newUserStateMap[uid] = update.updates[uid];
        }
        console.log("WS message", data.data, "new state map:", newUserStateMap);
        setUserStateMap(newUserStateMap);
      } catch (err) {
        console.error(
          `Error ${err} receiving data from ws: ${data.data}; continuing`
        );
      }
    };
    return () => {
      ws.close();
      setUserStateMap({});
    };
  }, [user]);

  useEffect(() => {
    // const connection = new JitsiMeetJS.JitsiConnection(null, null, {
    //   serviceUrl: JITSI_URL || DEFAULT_JITSI_URL,
    //   hosts: {
    //     domain: JITSI_DOMAIN || DEFAULT_JITSI_DOMAIN,
    //     muc: JITSI_DOMAIN || DEFAULT_JITSI_DOMAIN,
    //   },
    //   bosh: `${JITSI_DOMAIN || DEFAULT_JITSI_DOMAIN}/http-bind`,
    //   enableLipSync: false,
    // });
    const connection = new JitsiMeetJS.JitsiConnection(null, null, {
      hosts: {
        domain: "meet.jit.si",
        muc: "conference.meet.jit.si",
        focus: "focus.meet.jit.si",
      },
      externalConnectUrl: "https://meet.jit.si/http-pre-bind",
      enableP2P: true,
      p2p: {
        enabled: true,
        preferH264: true,
        disableH264: true,
        useStunTurn: true,
      },
      useStunTurn: true,
      bosh: `https://meet.jit.si/http-bind?room=${DEFAULT_JITSI_ROOM_NAME}`,
      websocket: "wss://meet.jit.si/xmpp-websocket",
      clientNode: "http://jitsi.org/jitsimeet",
    });

    let room: any; // any; No @types for jitsi yet, sadly

    const onTrackAdded = (a: any, b: any, c: any) => {
      console.log("ontrackAdded", a, b, c);
    };
    const onConferenceJoined = (a: any, b: any, c: any) => {
      console.log("onConferenceJoined", a, b, c);
    };
    const onTrackRemoved = (a: any, b: any, c: any) => {
      console.log("onTrackRemoved", a, b, c);
    };

    const onConnectionEstablished = (a: any, b: any, c: any) => {
      console.log("onConnectionEstablished", a, b, c);
      const name = JITSI_ROOM_NAME || DEFAULT_JITSI_ROOM_NAME;
      room = connection.initJitsiConference(name, {
        openBridgeChannel: true,
      });
      room.join();
      room.setDisplayName(user?.uid);
      const localTracks = room.getLocalTracks();
      console.log("local tracks", localTracks);
      room.on(JitsiMeetJS.events.conference.TRACK_ADDED, onTrackAdded);
      room.on(JitsiMeetJS.events.conference.TRACK_ADDED, onConferenceJoined);
      room.on(JitsiMeetJS.events.conference.TRACK_REMOVED, onTrackRemoved);
    };

    const onConnectionFailed = (err: any) => {
      console.error(`Jitsi connection failed. Error: ${err}`);
    };

    const onConnectionDisconnected = () => {
      console.log("Jitsi connection disconnected.");
    };

    connection.addEventListener(
      JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED,
      onConnectionEstablished
    );
    connection.addEventListener(
      JitsiMeetJS.events.connection.CONNECTION_FAILED,
      onConnectionFailed
    );
    connection.addEventListener(
      JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED,
      onConnectionDisconnected
    );
    console.log("about to connect to jitsi", connection);
    connection.connect();

    return () => {
      if (room) {
        room.leave();
        room.off(JitsiMeetJS.events.conference.TRACK_ADDED, onTrackAdded);
        room.off(JitsiMeetJS.events.conference.TRACK_ADDED, onConferenceJoined);
        room.off(JitsiMeetJS.events.conference.TRACK_REMOVED, onTrackRemoved);
      }

      connection.disconnect();
      connection.removeEventListener(
        JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED,
        onConnectionEstablished
      );
      connection.removeEventListener(
        JitsiMeetJS.events.connection.CONNECTION_FAILED,
        onConnectionFailed
      );
      connection.removeEventListener(
        JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED,
        onConnectionDisconnected
      );
    };
  }, [user]);

  return <>TO BE IMPLEMENTED</>;
};

export default AvatarLayer;
