import { Engine, NodeList, System } from "@ash.ts/ash";

import { GameControls } from "../../common";
import { getNormilzedYFromBezier } from "../../utils/bezierCurveFunction";
import { ViewportNode } from "../nodes/ViewportNode";

export class MotionBaseSystem extends System {
  private speedByZoomLevel: Array<number>;
  protected viewport?: NodeList<ViewportNode>;
  protected cashedZoom: number = 0;
  protected cashedSpeed: number = 0;

  constructor(protected _controls: GameControls) {
    super();
    this.speedByZoomLevel = this._controls.getConfig().speedByZoomLevelArray;
  }

  protected getSpeedByZoomLevel(zoomLevel: number = 0): number {
    return this.speedByZoomLevel[zoomLevel];
  }

  protected getSpeed() {
    const min = 0.1;
    const max = 8;
    const minSpeed = this._controls.getConfig().minSpeed;
    const maxSpeed = this._controls.getConfig().maxSpeed;
    const points = this._controls.getConfig().pointForBezieSpeedCurve;
    const zoom = this.viewport?.head?.viewport.zoomViewport ?? 1;

    if (this.cashedZoom === zoom) return this.cashedSpeed;

    const n = Math.log((zoom - min) / (min * 1.2)) / Math.log(1.2);

    let k = getNormilzedYFromBezier(
      points[3],
      points[2],
      points[1],
      points[0],
      min,
      max,
      min + (n < 0 ? 0 : n) * ((6 - min) / 20)
    );
    if (isNaN(k)) k = 1;
    if (k < 0) {
      k = 0;
    }
    if (k > 1) {
      k = 1;
    }
    const speed = minSpeed + (maxSpeed - minSpeed) * k;
    this.cashedSpeed = speed;
    return speed;
  }

  addToEngine(engine: Engine) {
    throw new Error("Method not implemented.");
  }

  removeFromEngine(engine: Engine) {
    throw new Error("Method not implemented.");
  }

  update(time: number) {
    throw new Error("Method not implemented.");
  }
}
