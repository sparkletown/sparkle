import React, { useEffect, useRef, useState } from "react";
import { useStore } from "react-redux";

import {
  enterAnimateMapFireBarrel,
  exitAnimateMapFireBarrel,
  updateAnimateMapFireBarrel,
} from "store/actions/AnimateMap";

import { AnimateMapVenue } from "types/venues";

import { WithId } from "utils/id";

import { useDispatch } from "hooks/useDispatch";

import { CloudDataProviderWrapper } from "./bridges/CloudDataProviderWrapper";
import { CloudDataProvider } from "./bridges/DataProvider/CloudDataProvider";
import { GameConfig } from "./configs/GameConfig";
import { GameInstance } from "./game/GameInstance";
import { useRelatedPartymapRooms } from "./hooks/useRelatedPartymapRooms";
import { FirebarrelProvider, UIOverlay, UIOverlayGrid } from "./components";
import { configs } from "./configs";

import "./AnimateMap.scss";

export interface AnimateMapProps {
  venue: WithId<AnimateMapVenue>;
}

export const AnimateMap: React.FC<AnimateMapProps> = ({ venue }) => {
  const [dataProvider, setDataProvider] = useState<CloudDataProvider | null>(
    null
  );
  const [app, setApp] = useState<GameInstance | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const store = useStore();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!app && dataProvider && containerRef && containerRef.current) {
      const config = venue.gameOptions
        ? new GameConfig(venue.gameOptions)
        : configs.animateMap;
      const game = new GameInstance(
        config,
        store,
        dataProvider,
        containerRef.current as HTMLDivElement
      );

      game
        .init()
        .then(() => game.start())
        .catch(console.error);

      setApp(game);
    }
  }, [containerRef, app, dataProvider, store, venue]);

  useEffect(() => {
    return () => {
      app?.release();
    };
  }, [app]);

  const [showFirebarrelFlag, setShowFirebarrelFlag] = useState(false);

  const relatedRooms = useRelatedPartymapRooms({ venue });

  return (
    <div className="AnimateMap">
      <div className="AnimateMap__ui-wrapper">
        <UIOverlay venue={venue}>
          <div className="UIOverlay__main">
            <UIOverlayGrid venue={venue} />
          </div>
          <div
            className={
              "UIOverlay__bottom-panel" +
              (showFirebarrelFlag ? " UIOverlay__bottom-panel--show" : "")
            }
          >
            <FirebarrelProvider
              venue={venue}
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
        venue={venue}
        newDataProviderCreate={setDataProvider}
        relatedRooms={relatedRooms}
      />
    </div>
  );
};
