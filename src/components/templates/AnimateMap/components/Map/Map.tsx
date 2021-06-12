import { AppContext, Container, Sprite } from "react-pixi-fiber";
import React, { useContext, useEffect, useState } from "react";
import * as PIXI from "pixi.js";
import WheelContainer from "../WheelContainer/WhellContainer";
import { throttle } from "lodash";

const INITIAL_SCALE = 0.13;
const SCALE_DIFF = 0.01;
const THROTTLE_CANVAS_WHEEL = 50;

export const Map = ({ ...props }) => {
  const app = useContext(AppContext);

  const map = PIXI.Texture.from("/AnimateMap/SPA_PlayaMap_2021-06-08-min.jpg"); //TODO: вынести управление ресурсами

  const [scale, setScale] = useState(INITIAL_SCALE);

  const wheelHandler = (event: WheelEvent) => {
    console.log("container wheel");
    setScale(scale + SCALE_DIFF * (event.deltaY > 0 ? -1 : 1));
  };

  const canvasWheelHandler = throttle((event: WheelEvent) => {
    console.log("CANVAS WHEEL");
    const mousePosition = new PIXI.Point().set(event.clientX, event.clientY);
    //Note: renderer not ready for first calls
    const triggeredSprite = app.renderer?.plugins.interaction.hitTest(
      mousePosition,
      app.stage
    );
    if (triggeredSprite) triggeredSprite.emit("wheel", event);
  }, THROTTLE_CANVAS_WHEEL);

  useEffect(() => {
    app.view.addEventListener("wheel", canvasWheelHandler);
    return () => app.view.removeEventListener("wheel", canvasWheelHandler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <WheelContainer onWheel={wheelHandler} {...props}>
      <Container scale={scale}>
        <Sprite texture={map} />
      </Container>
    </WheelContainer>
  );
};
