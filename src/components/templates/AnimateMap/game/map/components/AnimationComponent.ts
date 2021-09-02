import { Animatable } from "../graphics/Animatable";
// refactor to array of Animatable
export class AnimationComponent {
  public animation: Animatable;
  public alive: number;

  constructor(animation: Animatable, alive: number) {
    this.animation = animation;
    this.alive = alive;
  }
}
