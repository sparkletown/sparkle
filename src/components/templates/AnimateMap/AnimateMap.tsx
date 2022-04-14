import React, { useEffect, useRef, useState } from "react";
import { useStore } from "react-redux";
import { useAsyncFn } from "react-use";
import Bugsnag from "@bugsnag/js";

import { AnimateMapSpaceWithId } from "types/id";

import { AnimateMapErrorPrompt } from "components/templates/AnimateMap/components/AnimateMapErrorPrompt";

import { LoadingSpinner } from "components/atoms/LoadingSpinner";

import { AnimateMapGameConfig } from "../AnimateMapConfig";
import { AnimateMapUI } from "../AnimateMapUI";

import { CloudDataProviderWrapper } from "./bridges/CloudDataProviderWrapper";
import { CloudDataProvider } from "./bridges/DataProvider/CloudDataProvider";
import { GameConfig as GameConfigOld } from "./configs/GameConfig";
import { GameConfig } from "./game/common";
import { GameInstance } from "./game/GameInstance";
import { PlaygroundMap } from "./game/utils/PlaygroundMap";
import { useRelatedPartymapRooms } from "./hooks/useRelatedPartymapRooms";
import { UIOverlay, UIOverlayGrid } from "./components";
import { configs } from "./configs";

import "./AnimateMap.scss";

export interface AnimateMapProps {
  space: AnimateMapSpaceWithId;
}

export const AnimateMap: React.FC<AnimateMapProps> = (props) => {
  const [dataProvider, setDataProvider] = useState<CloudDataProvider | null>(
    null
  );
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const store = useStore();

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

      const game = new GameInstance(
        config,
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

  return (
    <>
      <AnimateMapUI gameAreaRef={gameAreaRef} />
      <CloudDataProviderWrapper
        venue={props.space}
        newDataProviderCreate={setDataProvider}
        relatedRooms={relatedRooms}
        reInitOnError={true}
      />
    </>
  );
};

export const AnimateMapOld: React.FC<AnimateMapProps> = ({ space }) => {
  const [dataProvider, setDataProvider] = useState<CloudDataProvider | null>(
    null
  );
  const [app, setApp] = useState<GameInstance | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const store = useStore();

  const [
    { loading: isInitializing, error: errorInitializing },
    initialize,
  ] = useAsyncFn(async () => {
    if (app || !dataProvider || !containerRef || !containerRef.current) {
      return;
    }

    const config = space.gameOptions
      ? new GameConfigOld(space.gameOptions)
      : configs.animateMap;

    console.log("old setApp", setApp);
    console.log("old config", config);
    console.log("old store", store);

    // const game = new GameInstance(
    //   config as unknown as GameConfigOld,
    //   store,
    //   dataProvider,
    //   containerRef.current as HTMLDivElement,
    //   null as unknown as PlaygroundMap,
    // );

    // await game.init();
    // await game.start();
    //
    // setApp(game);
  }, [containerRef, app, dataProvider, store, space]);

  useEffect(() => void initialize(), [initialize]);
  useEffect(() => () => void app?.release(), [app]);

  const relatedRooms = useRelatedPartymapRooms({ venue: space });

  if (isInitializing) {
    return <LoadingSpinner />;
  }

  // NOTE: this is a good to have check for error inside animatemap (and infinite retries due to it)
  if (errorInitializing) {
    console.error("AnimateMap error initializing:", errorInitializing);
    Bugsnag.notify(errorInitializing, (event) => {
      event.addMetadata("context", {
        location: "src/components/templates/AnimateMap::AnimateMap",
        errorInitializing,
        space,
      });
    });

    return (
      <AnimateMapErrorPrompt variant="unknown">
        {errorInitializing.message}
      </AnimateMapErrorPrompt>
    );
  }

  return (
    <div
      data-bem="AnimateMap"
      data-block="AnimateMap"
      data-side="att"
      className="AnimateMap"
    >
      <div className="AnimateMap__ui-wrapper">
        <UIOverlay venue={space}>
          <div className="UIOverlay__main">
            <UIOverlayGrid venue={space} />
          </div>
          <div className={"UIOverlay__bottom-panel"} />
        </UIOverlay>
      </div>
      <div ref={containerRef} className="AnimateMap__app-wrapper" />
      <CloudDataProviderWrapper
        venue={space}
        newDataProviderCreate={setDataProvider}
        relatedRooms={relatedRooms}
        reInitOnError={!errorInitializing}
      />
    </div>
  );
};
