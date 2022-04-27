import React, { useEffect, useRef, useState } from "react";
import { useStore } from "react-redux";
import { subscribeActionAfter } from "redux-subscribe-action";

import { useDispatch } from "hooks/useDispatch";

import {
  AnimateMapRoom,
  AnimateMapSpace,
  setAnimateMapRoom,
  setAnimateMapZoom,
} from "../AnimateMapCommon";
import { AnimateMapGameConfig } from "../AnimateMapConfig";
import { AnimateMapUI } from "../AnimateMapUI";

import { CloudDataProviderWrapper } from "./bridges/CloudDataProviderWrapper";
import { CloudDataProvider } from "./bridges/DataProvider/CloudDataProvider";
import { GameConfig, GameControls } from "./game/common";
import { GameInstance } from "./game/GameInstance";
import { PlaygroundMap } from "./game/utils/PlaygroundMap";
import { useRelatedPartymapRooms } from "./hooks/useRelatedPartymapRooms";

// import { UIOverlay, UIOverlayGrid } from "./components";
import "./AnimateMap.scss";

export interface AnimateMapProps {
  space: AnimateMapSpace;
}

export const AnimateMap: React.FC<AnimateMapProps> = (props) => {
  const [dataProvider, setDataProvider] = useState<CloudDataProvider | null>(
    null
  );
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const store = useStore();
  const dispatch = useDispatch();
  const relatedRooms = useRelatedPartymapRooms({ venue: props.space });

  useEffect(() => {
    if (dataProvider) {
      // const config: GameConfig = props.space.gameOptions
      //   ? new AnimateMapGameConfig(props.space.gameOptions)
      //   : configs.animateMap;
      const config: GameConfig = new AnimateMapGameConfig(
        props.space.gameOptions
      );

      const playgroundMap = new PlaygroundMap(config);

      const controls: GameControls = {
        playgroundMap: playgroundMap,
        dispatch: (data: { type: string }) => store.dispatch(data),
        getUsers: () => store.getState().animatemap.users,
        getEnvironmentSound: () => store.getState().animatemap.environmentSound,
        getZoomLevel: () => store.getState().animatemap.zoomLevel,
        getLastZoom: () => store.getState().animatemap.lastZoom,
        getConfig: () => config,
      };

      const game = new GameInstance(
        config,
        controls,
        store,
        dataProvider,
        gameAreaRef.current as HTMLDivElement,
        playgroundMap
      );

      game
        .init()
        .then(() => {
          console.log("game init success");
          game
            .start()
            .then(() => console.log("game start success"))
            .catch((e) => console.log("game start error", e));
        })
        .catch((e) => console.log("game init error", e));
    }
  }, [gameAreaRef, store, dataProvider, props.space.gameOptions]);

  const onSetAnimateMapZoom = (zoom: number) => {
    dispatch(setAnimateMapZoom(zoom));
  };

  const onSetAnimateMapRoom = (room: AnimateMapRoom) => {
    dispatch(setAnimateMapRoom(room));
  };

  return (
    <>
      <AnimateMapUI
        gameAreaRef={gameAreaRef}
        space={props.space}
        subscribeActionAfter={subscribeActionAfter}
        onSetAnimateMapZoom={onSetAnimateMapZoom}
        onSetAnimateMapRoom={onSetAnimateMapRoom}
      />
      <CloudDataProviderWrapper
        venue={props.space}
        newDataProviderCreate={setDataProvider}
        relatedRooms={relatedRooms}
        reInitOnError={true}
      />
    </>
  );
};
