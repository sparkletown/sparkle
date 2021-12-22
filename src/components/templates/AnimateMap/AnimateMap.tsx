import React, { useEffect, useRef, useState } from "react";
import { useStore } from "react-redux";
import { useAsyncFn } from "react-use";
import Bugsnag from "@bugsnag/js";

import {
  enterAnimateMapFireBarrel,
  exitAnimateMapFireBarrel,
  updateAnimateMapFireBarrel,
} from "store/actions/AnimateMap";

import { AnimateMapVenue } from "types/venues";

import { WithId } from "utils/id";

import { useDispatch } from "hooks/useDispatch";

import { LoadingSpinner } from "components/atoms/LoadingSpinner";

import { CloudDataProviderWrapper } from "./bridges/CloudDataProviderWrapper";
import { CloudDataProvider } from "./bridges/DataProvider/CloudDataProvider";
import { GameConfig } from "./configs/GameConfig";
import { GameInstance } from "./game/GameInstance";
import { useRelatedPartymapRooms } from "./hooks/useRelatedPartymapRooms";
import { FirebarrelProvider, UIOverlay, UIOverlayGrid } from "./components";
import { configs } from "./configs";

import "./AnimateMap.scss";

const ERROR_TITLE = `We got bugs! \u{1F997}\u{1F41B}\u{1F577}\u{0FE0F}\u{1F41E}\u{1F351}`;
const ERROR_MESSAGE = `
Try reloading the page.
If that fails, get a glass and a sheet of paper, catch the bug, and take it outside.
If the problem persists after refresh, take a screenshot and get in touch
`;

export interface AnimateMapProps {
  space: WithId<AnimateMapVenue>;
}

export const AnimateMap: React.FC<AnimateMapProps> = ({ space }) => {
  const [dataProvider, setDataProvider] = useState<CloudDataProvider | null>(
    null
  );
  const [app, setApp] = useState<GameInstance | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const store = useStore();
  const dispatch = useDispatch();

  const [
    { loading: isInitializing, error: errorInitializing },
    initialize,
  ] = useAsyncFn(async () => {
    if (app || !dataProvider || !containerRef || !containerRef.current) {
      return;
    }

    const config = space.gameOptions
      ? new GameConfig(space.gameOptions)
      : configs.animateMap;

    const game = new GameInstance(
      config,
      store,
      dataProvider,
      containerRef.current as HTMLDivElement
    );

    await game.init();
    await game.start();

    setApp(game);
  }, [containerRef, app, dataProvider, store, space]);

  useEffect(() => void initialize(), [initialize]);
  useEffect(() => () => void app?.release(), [app]);

  const [showFirebarrelFlag, setShowFirebarrelFlag] = useState(false);

  const relatedRooms = useRelatedPartymapRooms({ venue: space });

  if (isInitializing) {
    return <LoadingSpinner />;
  }

  // @debt There is a better (recommended by React devs) way of dealing with this by means of <Suspense />, might want to look at that
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
      <div className="AnimateMap AnimateMap--error">
        <div className="AnimateMap__init-message">
          <p className="AnimateMap__init-message--normal">
            {ERROR_TITLE}
            <br />
            {ERROR_MESSAGE.split("\n").map((line) => (
              <>
                {line}
                <br />
              </>
            ))}
            The bug:
          </p>
          <p className="AnimateMap__init-message--error">
            {errorInitializing.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="AnimateMap">
      <div className="AnimateMap__ui-wrapper">
        <UIOverlay venue={space}>
          <div className="UIOverlay__main">
            <UIOverlayGrid venue={space} />
          </div>
          <div
            className={
              "UIOverlay__bottom-panel" +
              (showFirebarrelFlag ? " UIOverlay__bottom-panel--show" : "")
            }
          >
            <FirebarrelProvider
              venue={space}
              setUserList={(roomId, userList) => {
                dispatch(updateAnimateMapFireBarrel(roomId, userList));
              }}
              onConnectChange={(roomId, userList, isConnected) => {
                if (isConnected) {
                  dispatch(enterAnimateMapFireBarrel(roomId, userList));
                } else {
                  dispatch(exitAnimateMapFireBarrel(roomId));
                }

                setShowFirebarrelFlag(isConnected);
              }}
            />
          </div>
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
