import { Point } from "types/utility";

import { GameConfig } from "../common";
// import { GameInstance } from "../GameInstance";

export class PlaygroundMap {
  constructor(private _config: GameConfig) {}

  private static playgroundBounds: Array<number> = [
    5055,
    233,
    9736,
    4038,
    7812,
    9423,
    1925,
    8958,
    246,
    3271,
    5055,
    233,
  ];

  public pointIsInTheOuterCircle(x: number, y: number): boolean {
    // const config: GameConfig = GameInstance.instance.getConfig();
    const outerRadius = this._config.borderRadius;
    const worldCenter: Point = this._config.worldCenter;

    const deltaX = x - worldCenter.x;
    const deltaY = y - worldCenter.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    return distance <= outerRadius;
  }

  public pointIsInTheCentralCircle(x: number, y: number): boolean {
    // const config: GameConfig = GameInstance.instance.getConfig();
    const center: Point = this._config.worldCenter;
    const radius = this._config.worldWidth * 0.073;

    const deltaX = x - center.x;
    const deltaY = y - center.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    // console.log('distance radius', distance, radius, distance <= radius)
    return distance <= radius;
  }

  public pointIsOnThePlayground(x: number, y: number) {
    return PlaygroundMap.pointIsOnThePlayground(x, y);
  }
  public static pointIsOnThePlayground(x: number, y: number): boolean {
    for (let i = 0; i < 9; i += 2) {
      const x1 = this.playgroundBounds[i];
      const y1 = this.playgroundBounds[i + 1];
      const x2 = this.playgroundBounds[i + 2];
      const y2 = this.playgroundBounds[i + 3];

      const d = (x - x1) * (y2 - y1) - (y - y1) * (x2 - x1);
      if (d > 0) {
        return false;
      }
    }
    return true;
  }

  public getPointIfBoundingPlaygroundBorder(
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ): { x: number; y: number } | undefined {
    if (
      this.pointIsInTheOuterCircle(x1, y1) &&
      this.pointIsInTheOuterCircle(x2, y2)
    ) {
      return undefined;
    }

    for (let i = 0; i < 9; i += 2) {
      const x3 = PlaygroundMap.playgroundBounds[i];
      const y3 = PlaygroundMap.playgroundBounds[i + 1];
      const x4 = PlaygroundMap.playgroundBounds[i + 2];
      const y4 = PlaygroundMap.playgroundBounds[i + 3];

      const result = this.checkIntersection(x1, y1, x2, y2, x3, y3, x4, y4);
      if (result) {
        return result;
      }
    }
    return undefined;
  }

  public checkIntersection(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number,
    x4: number,
    y4: number
  ): { x: number; y: number } | undefined {
    const denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
    const numeA = (x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3);
    const numeB = (x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3);

    // if (denom === 0) {
    //   if (numeA === 0 && numeB == 0) {
    //     return COLINEAR;
    //   }
    //   return PARALLEL;
    // }

    const uA = numeA / denom;
    const uB = numeB / denom;

    if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
      return {
        x: x1 + uA * (x2 - x1),
        y: y1 + uA * (y2 - y1),
      };
    }

    return undefined;
  }

  public getRandomPointInTheCentralCircle(): Point {
    // const config: GameConfig = GameInstance.instance.getConfig();
    const center: Point = this._config.worldCenter;
    const radius = this._config.worldWidth * 0.073;

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
    const max = this._config.worldWidth;
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
