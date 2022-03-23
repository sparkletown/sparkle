import React, { useEffect, useState } from "react";

import { User } from "types/User";
import { AnimateMapVenue } from "types/venues";

import { WithId } from "utils/id";

import { bugsnagNotify } from "../Bugsnag";

import { AnimateMapErrorPrompt } from "./components/AnimateMapErrorPrompt";
import { GameInstance } from "./game/GameInstance";
import { FirebarrelProvider, UIOverlay, UIOverlayGrid } from "./components";

import "./AnimateMap.scss";

export interface AnimateMapProps {
  space: WithId<AnimateMapVenue>;
  updateAnimateMapFireBarrelDispatch: (
    roomId: string,
    userList: User[]
  ) => void;
  onConnectFirebarrelChange: (
    roomId: string,
    userList: User[],
    isConnected: boolean
  ) => void;
  showFirebarrelFlag: boolean;
  game: GameInstance | null;
  containerRef: {
    current: HTMLDivElement | null;
  };
}

export const AnimateMap: React.FC<AnimateMapProps> = (props) => {
  const [appError, setAppError] = useState<Error | null>(null);

  const runApp = async () => {
    if (props.game) {
      await props.game.init();
      await props.game.start();
    }
  };

  useEffect(() => {
    if (!props.game) {
      return;
    }

    runApp()
      .catch((e) => setAppError(e));
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.game]);

  // NOTE: this is a good to have check for error inside animatemap (and infinite retries due to it)
  if (appError) {
    console.error("AnimateMap error initializing:", appError);
    bugsnagNotify({
      appError: appError,
      location: "src/components/templates/AnimateMap::AnimateMap",
      space: props.space,
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
              (props.showFirebarrelFlag ? " UIOverlay__bottom-panel--show" : "")
            }
          >
            <FirebarrelProvider
              venue={props.space}
              setUserList={props.updateAnimateMapFireBarrelDispatch}
              onConnectChange={props.onConnectFirebarrelChange}
            />
          </div>
        </UIOverlay>
      </div>
      <div ref={props.containerRef} className="AnimateMap__app-wrapper" />
    </div>
  );
};
