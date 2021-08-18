import React, { useEffect, useState } from "react";
import { subscribeActionAfter } from "redux-subscribe-action";

import {
  AnimateMapActionTypes,
  setAnimateMapFireBarrelAction,
} from "store/actions/AnimateMap";

import { AnimateMapVenue } from "types/venues";

import { FirebarrelWidget } from "./FirebarrelWidget";

export interface FirebarrelProviderProps {
  venue: AnimateMapVenue;
}

export const FirebarrelProvider: React.FC<FirebarrelProviderProps> = ({
  venue,
}) => {
  const [selectedFirebarrel, setSelectedFirebarrel] = useState<
    string | undefined
  >();

  useEffect(() => {
    const unsubscribe = subscribeActionAfter(
      AnimateMapActionTypes.SET_FIREBARREL,
      (action) => {
        setSelectedFirebarrel(
          (action as setAnimateMapFireBarrelAction).payload.roomId
        );
      }
    );
    return () => {
      unsubscribe();
    };
  });

  return selectedFirebarrel ? (
    <FirebarrelWidget
      roomName={selectedFirebarrel}
      venueName={venue.name}
      setUserList={() => {}}
      isAudioEffectDisabled={false}
    />
  ) : (
    <></>
  );
};
