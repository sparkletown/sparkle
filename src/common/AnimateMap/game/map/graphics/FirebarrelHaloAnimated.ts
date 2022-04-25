import { Texture } from "pixi.js";

import { Animatable } from "./Animatable";
import { FirebarrelHalo } from "./FirebarrelHalo";

export class FirebarrelHaloAnimated
  extends FirebarrelHalo
  implements Animatable {
  private direction = 1;
  private time = 0;
  private duration = FirebarrelHaloAnimated.getRandomInt(50, 60);
  private directionFactorIn = 1;
  private directionFactorOut = 1;

  protected get texture(): Texture {
    return FirebarrelHalo.FIREBARELL_HALO_GREEN;
  }

  setup(): void {
    super.setup();
    if (this.view && this.view.halo) {
      this.view.halo.scale.set(FirebarrelHalo.SCALE * 1.2);
    }
  }

  animate(time: number) {
    if (!this.view.halo) {
      return;
    }

    this.time +=
      time *
      (this.direction === 1
        ? this.directionFactorIn
        : this.directionFactorOut) *
      this.direction;

    if (this.time <= 0) {
      this.time = 0;
      this.direction = 1;
    } else if (this.time >= this.duration) {
      this.time = this.duration;
      this.direction = -1;
    }
    const value =
      FirebarrelHaloAnimated.getValue(this.time / this.duration) * 0.6;
    this.view.halo.alpha = 0.4 + value;
  }

  static getValue(x: number): number {
    return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
  }

  static getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
