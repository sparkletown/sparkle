import React, { useEffect, useRef, useState } from "react";
import { useStore } from "react-redux";
import { useFirebase } from "react-redux-firebase";

import { AnimateMapVenue } from "types/venues";

import { WithId } from "utils/id";

import { useUser } from "hooks/useUser";

import { CloudDataProvider } from "./bridges/DataProvider/CloudDataProvider";
import { UIOverlayGrid } from "./components/UIOverlayGrid/UIOverlayGrid";
import { GameConfig } from "./configs/GameConfig";
import { GameInstance } from "./game/GameInstance";
import { configs } from "./configs";

import "./AnimateMap.scss";

export interface AnimateMapProps {
  venue: WithId<AnimateMapVenue>;
}

export const AnimateMap: React.FC<AnimateMapProps> = ({ venue }) => {
  const [app, setApp] = useState<GameInstance | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const firebase = useFirebase();
  const store = useStore();
  const user = useUser();

  useEffect(() => {
    if (
      !app &&
      containerRef &&
      containerRef.current &&
      typeof user.userId === "string"
    ) {
      const dataProvider = new CloudDataProvider(
        user.userId,
        user.profile?.pictureUrl,
        firebase,
        venue.playerioGameId
      );

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
        .catch((error) => console.log(error));

      setApp(game);
    }
  }, [containerRef, app, firebase, store, user, venue]);

  useEffect(() => {
    return () => {
      app?.release();
    };
  }, [app]);

  return (
    <div className="AnimateMap">
      <div className="AnimateMap__ui-wrapper">
        <UIOverlayGrid venue={venue} />
      </div>
      <div ref={containerRef} className="AnimateMap__app-wrapper" />
    </div>
  );
};
