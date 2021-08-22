import { Point } from "types/utility";

import { GameConfig } from "../../configs/GameConfig";
import { GameInstance } from "../GameInstance";

const k = 1440 / 9920; //TODO: rework

export class PlaygroundMap {
  private playgroundBounds: Array<number> = [
    k * 5055,
    k * 233,
    k * 9736,
    k * 4038,
    k * 7812,
    k * 9423,
    k * 1925,
    k * 8958,
    k * 246,
    k * 3271,
    k * 5055,
    k * 233,
  ];

  public pointIsInTheCentralCircle(x: number, y: number): boolean {
    const config: GameConfig = GameInstance.instance.getConfig();
    const center: Point = config.worldCenter;
    const radius = config.worldWidth * 0.073;

    const deltaX = x - center.x;
    const deltaY = y - center.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    // console.log('distance radius', distance, radius, distance <= radius)
    return distance <= radius;
  }

  public pointIsOnThePlayground(x: number, y: number): boolean {
    for (let i = 0; i < 9; i += 2) {
      const x1: number = this.playgroundBounds[i];
      const y1: number = this.playgroundBounds[i + 1];
      const x2: number = this.playgroundBounds[i + 2];
      const y2: number = this.playgroundBounds[i + 3];

      const d = (x - x1) * (y2 - y1) - (y - y1) * (x2 - x1);
      if (d > 0) {
        return false;
      }
    }
    return true;
  }

  public getRandomPointInTheCentralCircle(): Point {
    const config: GameConfig = GameInstance.instance.getConfig();
    const center: Point = config.worldCenter;
    const radius = config.worldWidth * 0.073;

    let x = 0;
    let y = 0;
    let result = false;
    while (!result) {
      x = this.getRandomNumber(center.x - radius, center.x + radius);
      y = this.getRandomNumber(center.y - radius, center.y + radius);
      result = this.pointIsInTheCentralCircle(x, y);
    }

    return { x, y };
  }

  public getRandomPointOnThePlayground(): Point {
    const min = 100;
    const max = GameInstance.instance.getConfig().worldWidth;
    let x = 0;
    let y = 0;
    let result = false;
    while (!result) {
      x = this.getRandomNumber(min, max);
      y = this.getRandomNumber(min, max);
      result = this.pointIsOnThePlayground(x, y);
    }

    return { x, y };
  }

  private getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min) + min);
  }
}
