import React, { useEffect, useState } from "react";

import { User } from "types/User";

import { BugsnagNotify } from "../Bugsnag";
import { GameInstance } from "../GameInstance/GameInstance";
import { AnimateMapVenue } from "../types";

import { AnimateMapErrorPrompt } from "./components/AnimateMapErrorPrompt";
import { FirebarrelProvider, UIOverlay, UIOverlayGrid } from "./components";

import "./AnimateMap.scss";

export interface AnimateMapProps {
  space: AnimateMapVenue;
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
      .then(() => console.log("runApp success"))
      .catch((e) => setAppError(e));
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.game]);

  // NOTE: this is a good to have check for error inside animatemap (and infinite retries due to it)
  if (appError) {
    console.error("AnimateMap error initializing:", appError);
    BugsnagNotify({
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
          <div className={"UIOverlay__bottom-panel"}>
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
