import React, { RefObject } from "react";

import {
  AnimateMapRoom,
  AnimateMapSpace,
  SubscribeActionAfterListener,
} from "../../AnimateMapCommon";

import { AnimateMapUIOverlay } from "./AnimateMapUIOverlay";
import { AnimateMapUIOverlayGrid } from "./AnimateMapUIOverlayGrid";

import "./AnimateMapUI.scss";

export type AnimateMapUIProps = {
  space: AnimateMapSpace;
  gameAreaRef: RefObject<HTMLDivElement>;
  subscribeActionAfter: (
    action: string,
    listener: SubscribeActionAfterListener
  ) => () => void;
  onSetAnimateMapZoom: (zoom: number) => void;
  onSetAnimateMapRoom: (room: AnimateMapRoom) => void;
};

export const AnimateMapUI: React.VFC<AnimateMapUIProps> = (props) => (
  <div className="AnimateMapUI">
    <div className="AnimateMapUI__app-wrapper" ref={props.gameAreaRef} />
    <div className="AnimateMapUI__ui-wrapper">
      <AnimateMapUIOverlay venue={props.space}>
        <div className="UIOverlay__main">
          <AnimateMapUIOverlayGrid
            onSetAnimateMapZoom={props.onSetAnimateMapZoom}
            onSetAnimateMapRoom={props.onSetAnimateMapRoom}
            subscribeActionAfter={props.subscribeActionAfter}
            venue={props.space}
          />
        </div>
        <div className={"UIOverlay__bottom-panel"} />
      </AnimateMapUIOverlay>
    </div>
  </div>
);
