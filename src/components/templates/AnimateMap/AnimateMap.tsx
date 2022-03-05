import React, { useEffect, useRef, useState } from "react";
import { useStore } from "react-redux";
import Bugsnag from "@bugsnag/js";

import {
  enterAnimateMapFireBarrel,
  exitAnimateMapFireBarrel,
  updateAnimateMapFireBarrel,
} from "store/actions/AnimateMap";

import { AnimateMapVenue } from "types/venues";

import { WithId } from "utils/id";

import { useDispatch } from "hooks/useDispatch";

import { AnimateMapErrorPrompt } from "components/templates/AnimateMap/components/AnimateMapErrorPrompt";

import { CloudDataProviderWrapper } from "./bridges/CloudDataProviderWrapper";
import { CloudDataProvider } from "./bridges/DataProvider/CloudDataProvider";
import { GameConfig } from "./configs/GameConfig";
import { GameInstance } from "./game/GameInstance";
import { useRelatedPartymapRooms } from "./hooks/useRelatedPartymapRooms";
import { FirebarrelProvider, UIOverlay, UIOverlayGrid } from "./components";
import { configs } from "./configs";

import "./AnimateMap.scss";

export interface AnimateMapProps {
  space: WithId<AnimateMapVenue>;
}

export const AnimateMap: React.FC<AnimateMapProps> = (props) => {
  const [dataProvider, setDataProvider] = useState<CloudDataProvider | null>(
    null
  );
  const [app, setApp] = useState<GameInstance | null>(null);
  const [appError, setAppError] = useState<Error | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const store = useStore();
  const dispatch = useDispatch();
  const relatedRooms = useRelatedPartymapRooms({ venue: props.space });
  const [showFirebarrelFlag, setShowFirebarrelFlag] = useState(false);

  const runApp = async () => {
    if (app) {
      await app.init();
      await app.start();
    }
  };

  useEffect(() => {
    if (app || !dataProvider || !containerRef || !containerRef.current) {
      return;
    }

    const config = props.space.gameOptions
      ? new GameConfig(props.space.gameOptions)
      : configs.animateMap;

    const game = new GameInstance(
      config,
      store,
      dataProvider,
      containerRef.current as HTMLDivElement
    );

    setApp(game);
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataProvider]);

  useEffect(() => {
    if (!app) {
      return;
    }

    runApp()
      .then(() => console.log("runApp success"))
      .catch((e) => setAppError(e));
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [app]);

  // NOTE: this is a good to have check for error inside animatemap (and infinite retries due to it)
  if (appError) {
    console.error("AnimateMap error initializing:", appError);
    Bugsnag.notify(appError, (event) => {
      event.addMetadata("context", {
        location: "src/components/templates/AnimateMap::AnimateMap",
        errorInitializing: appError,
        space: props.space,
      });
    });

    return (
      <AnimateMapErrorPrompt variant="unknown">
        {appError.message}
      </AnimateMapErrorPrompt>
    );
  }

  return (
    <div className="AnimateMap">
      <div className="AnimateMap__ui-wrapper">
        <UIOverlay venue={props.space}>
          <div className="UIOverlay__main">
            <UIOverlayGrid venue={props.space} />
          </div>
          <div
            className={
              "UIOverlay__bottom-panel" +
              (showFirebarrelFlag ? " UIOverlay__bottom-panel--show" : "")
            }
          >
            <FirebarrelProvider
              venue={props.space}
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
        venue={props.space}
        newDataProviderCreate={setDataProvider}
        relatedRooms={relatedRooms}
        reInitOnError={void 0}
      />
    </div>
  );
};
