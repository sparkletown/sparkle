import { Sprite } from "pixi.js";

import { WithoutPlateVenueState } from "store/reducers/AnimateMap";

import { TimeoutCommand } from "../../commands/TimeoutCommand";

import { Animatable } from "./Animatable";
import { Flame } from "./Flame";
import { Venue } from "./Venue";
import { VenueHaloAnimated } from "./VenueHaloAnimated";

export class VenueBurn extends Venue implements Animatable {
  public burned: Sprite;
  public flame?: Flame;

  public currentState = WithoutPlateVenueState.idle;
  private animation?: Function;

  constructor() {
    super();

    this.main = new Sprite();
    this.main.anchor.set(0.5);
    this.addChild(this.main);

    this.burned = new Sprite();
    this.burned.alpha = 0;
    this.burned.anchor.set(0.5);
    this.addChild(this.burned);
  }

  animate(time: number) {
    if (this.animation) {
      this.animation(time);
    }
  }

  private getFlame(): Flame {
    const flame = new Flame();
    flame.scale.set(0.7);
    flame.anchor.set(0.5);

    flame.position.y = 130;

    return flame;
  }

  public changeState(state: WithoutPlateVenueState): void {
    this.currentState = state;

    switch (state) {
      case WithoutPlateVenueState.burn:
        if (this.flame) {
          return;
        }
        this.flame = this.getFlame();
        this.addChild(this.flame);

        new TimeoutCommand().execute().then(() => {
          return new Promise((resolve) => {
            let currentTime = 0;
            const duration = 200;
            this.animation = (time: number) => {
              currentTime += time;
              const value = Math.min(
                VenueHaloAnimated.getValue(currentTime / duration),
                1
              );
              if (this.flame) {
                this.flame.alpha = value;
              }
              if (value === 1) {
                this.animation = undefined;
                resolve(true);
              }
            };
          });
        });
        break;
      case WithoutPlateVenueState.burned:
        this.burned.alpha = 0;
        if (this.main) {
          this.main.alpha = 1;
        }

        let currentTime = 0;
        const duration = 200;
        this.animation = (time: number) => {
          currentTime += time;
          const value = Math.min(
            VenueHaloAnimated.getValue(currentTime / duration),
            1
          );
          if (this.flame) {
            this.flame.alpha = 1 - value;
          }
          this.burned.alpha = value;
          if (this.main) {
            this.main.alpha = 1 - value;
          }

          if (value === 1) {
            this.burned.alpha = value;
            if (this.main) {
              this.main.alpha = 0;
            }
            this.animation = undefined;
          }
        };
        break;
    }
  }

  public setState(state: WithoutPlateVenueState): void {
    this.currentState = state;

    switch (state) {
      case WithoutPlateVenueState.idle:
        if (this.flame && this.flame.parent) {
          this.flame.parent.removeChild(this.flame);
          this.flame = undefined;
        }
        this.burned.alpha = 0;
        if (this.main) {
          this.main.alpha = 1;
        }
        break;
      case WithoutPlateVenueState.burn:
        if (!this.flame) {
          this.flame = this.getFlame();
          this.addChild(this.flame);
        }
        this.burned.alpha = 0;
        if (this.main) {
          this.main.alpha = 1;
        }
        break;
      case WithoutPlateVenueState.burned:
        if (this.flame && this.flame.parent) {
          this.flame.parent.removeChild(this.flame);
          this.flame = undefined;
        }
        this.burned.alpha = 1;
        if (this.main) {
          this.main.alpha = 0;
        }
        break;
    }
  }

  static getValue(x: number): number {
    return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
  }
}
