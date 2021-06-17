import * as PIXI from "pixi.js";

import { PixiComponent } from "@inlet/react-pixi";
import { Viewport } from "pixi-viewport";

type ViewportProps = {
  screenWidth?: number;
  screenHeight?: number;
  worldWidth: number;
  worldHeight: number;
  interaction: PIXI.InteractionManager | undefined;
};

export default PixiComponent("Viewport", {
  create: (props: ViewportProps) => {
    const viewport = new Viewport({
      worldWidth: props.worldWidth,
      worldHeight: props.worldHeight,
      interaction: props.interaction,
    })
      .drag()
      .pinch()
      .wheel({ percent: 0.5, smooth: 10 })
      .decelerate()
      .clamp({
        left: true,
        right: true,
        top: true,
        bottom: true,
      })
      .clampZoom({
        maxWidth: props.worldWidth,
        maxHeight: props.worldHeight,
      });

    viewport.moveCenter(props.worldWidth / 2, props.worldHeight / 2);

    return viewport;
  },
  // config: {
  //   destroy: true,
  //   destroyChildren: true,
  // },
});
