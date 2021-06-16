import React from "react";
import { Sprite, useApp } from "@inlet/react-pixi";

import Viewport from "../Common/Viewport";
import { MAP_IMAGE } from "../../constants/Resources";
import { animateMapWorldBoundsSelector } from "../../../../../utils/selectors";
import { useSelector } from "hooks/useSelector";

export const Map = () => {
  const worldBounds = useSelector(animateMapWorldBoundsSelector);
  const app = useApp();

  return (
    <Viewport
      worldWidth={worldBounds.width}
      worldHeight={worldBounds.height}
      interaction={app.renderer.plugins.interaction}
    >
      <Sprite image={MAP_IMAGE} />
    </Viewport>
  );
};
