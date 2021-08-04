import { Engine, NodeList, System } from "@ash.ts/ash";
import { GameInstance } from "../../GameInstance";
import { getNormilzedYFromBezier } from "../../utils/bezierCurveFunction";
import { ViewportNode } from "../nodes/ViewportNode";

export class MotionBaseSystem extends System {
  private speedByZoomLevel: Array<number>;
  protected viewport: NodeList<ViewportNode> | null = null;
  protected cashedZoom: number = 0;
  protected cashedSpeed: number = 0;

  constructor() {
    super();
    this.speedByZoomLevel = GameInstance.instance.getConfig().speedByZoomLevelArray;
  }

  protected getSpeedByZoomLevel(zoomLevel: number = 0): number {
    const speed = this.speedByZoomLevel[zoomLevel];
    return speed;
  }

  protected getSpeed() {
    const min = 0.1;
    const max = 8;
    const minSpeed = GameInstance.instance.getConfig().minSpeed;
    const maxSpeed = GameInstance.instance.getConfig().maxSpeed;
    const points = GameInstance.instance.getConfig().pointForBezieSpeedCurve;
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
    if (k < 0) {
      console.error("k reset");
      k = 0;
    }
    if (k > 1) {
      console.error("k reset");
      k = 1;
    }
    const speed = minSpeed + (maxSpeed - minSpeed) * k;
    this.cashedSpeed = speed;
    return speed;
  }

  protected getArtcarDefaultSpeed(): number {
    return this.speedByZoomLevel[0];
  }

  addToEngine(engine: Engine): void {
    throw new Error("Method not implemented.");
  }

  removeFromEngine(engine: Engine): void {
    throw new Error("Method not implemented.");
  }

  update(time: number): void {
    throw new Error("Method not implemented.");
  }
}
