import { Animatable } from "./Animatable";
import { VenueHalo } from "./VenueHalo";

export class VenueHaloAnimated extends VenueHalo implements Animatable {
  private direction = 1;
  private time = 0;
  private duration = 60;
  private directionFactorIn = 1;
  private directionFactorOut = 1;

  animate(time: number) {
    if (!this.view.halo) {
      return;
    }

    const haloScale = VenueHalo.SCALE;
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
    const value = VenueHaloAnimated.getValue(this.time / this.duration) / 2;
    this.view.halo.scale.set(haloScale + value);
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
