import React, { useEffect, useState } from "react";
import { subscribeActionAfter } from "redux-subscribe-action";

import {
  AnimateMapActionTypes,
  setAnimateMapFireBarrelAction,
} from "store/actions/AnimateMap";

import { User } from "types/User";
import { AnimateMapVenue } from "types/venues";

import { FirebarrelWidget } from "./FirebarrelWidget";

export interface FirebarrelProviderProps {
  venue: AnimateMapVenue;
  onConnectChange: (roomId: string, val: User[], isConnected: boolean) => void;
  setUserList: (roomId: string, val: User[]) => void;
}

export const FirebarrelProvider: React.FC<FirebarrelProviderProps> = ({
  venue,
  onConnectChange,
  setUserList,
}) => {
  const [currentRoomId, setCurrentRoomId] = useState<string | undefined>();

  useEffect(() => {
    const unsubscribe = subscribeActionAfter(
      AnimateMapActionTypes.SET_FIREBARREL,
      (action) => {
        console.log("------ currentRoomId", currentRoomId, venue);
        if (!currentRoomId) {
          setCurrentRoomId(
            (action as setAnimateMapFireBarrelAction).payload.roomId
          );
        }
      }
    );
    return () => {
      unsubscribe();
    };
  });

  return currentRoomId ? (
    <FirebarrelWidget
      venue={venue}
      roomName={currentRoomId}
      onEnter={(roomId, userList) => {
        console.log("onEnter", true);
        onConnectChange(roomId, userList, true);
      }}
      onExit={(roomId) => {
        console.log("onExit", false);
        setCurrentRoomId(undefined);
        onConnectChange(roomId, [], false);
      }}
      setUserList={setUserList}
      isAudioEffectDisabled={false}
    />
  ) : (
    <></>
  );
};
