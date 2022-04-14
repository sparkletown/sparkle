import React, { RefObject } from "react";

import "./AnimateMapUI.scss";

export type AnimateMapUIProps = {
  gameAreaRef: RefObject<HTMLDivElement>;
};

export const AnimateMapUI: React.VFC<AnimateMapUIProps> = (props) => (
  <div className="AnimateMapUI">
    <div className="AnimateMapUI__app-wrapper" ref={props.gameAreaRef} />
    <div className="AnimateMapUI__ui-wrapper">
      UI==============================
    </div>
  </div>
);
