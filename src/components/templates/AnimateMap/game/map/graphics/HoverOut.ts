import { Easing } from "../../utils/Easing";

import { Animatable } from "./Animatable";
import { Hoverable } from "./Hoverable";

export class HoverOut implements Animatable {
  public easing?: Easing;

  constructor(sprite: Hoverable, duration: number) {
    if (sprite.main) {
      this.easing = new Easing(sprite.main.scale.x, 1, duration);
      this.easing.onStep = (value: number) => {
        sprite.main?.scale.set(value);
      };
    }
    if (sprite.halo) {
      sprite.halo.scale.set(sprite.halo.scale.y - sprite.halo.scale.y / 9);
    }
  }

  animate(time: number) {
    if (this.easing) {
      this.easing.update(time);
    }
  }
}
