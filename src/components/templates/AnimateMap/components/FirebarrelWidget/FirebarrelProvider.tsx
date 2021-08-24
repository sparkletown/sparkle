import React, { useEffect, useState } from "react";
import { subscribeActionAfter } from "redux-subscribe-action";

import {
  AnimateMapActionTypes,
  setAnimateMapFireBarrel,
  setAnimateMapFireBarrelAction,
} from "store/actions/AnimateMap";

import { AnimateMapVenue } from "types/venues";

import { useDispatch } from "../../../../../hooks/useDispatch";

import { FirebarrelWidget } from "./FirebarrelWidget";

export interface FirebarrelProviderProps {
  venue: AnimateMapVenue;
  onConnectChange: (isConnected: boolean) => void;
}

export const FirebarrelProvider: React.FC<FirebarrelProviderProps> = ({
  venue,
  onConnectChange,
}) => {
  const [selectedFirebarrel, setSelectedFirebarrel] = useState<
    string | undefined
  >();
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = subscribeActionAfter(
      AnimateMapActionTypes.SET_FIREBARREL,
      (action) => {
        onConnectChange(typeof selectedFirebarrel === "string");
        setSelectedFirebarrel(
          (action as setAnimateMapFireBarrelAction).payload.roomId
        );
      }
    );
    return () => {
      unsubscribe();
    };
  });

  const onExit = () => {
    dispatch(setAnimateMapFireBarrel(""));
    onConnectChange(false);
  };

  return selectedFirebarrel && selectedFirebarrel !== "" ? (
    <FirebarrelWidget
      roomName={selectedFirebarrel}
      venueName={venue.name}
      setUserList={() => {}}
      onExit={() => onExit()}
      isAudioEffectDisabled={false}
    />
  ) : (
    <></>
  );
};
