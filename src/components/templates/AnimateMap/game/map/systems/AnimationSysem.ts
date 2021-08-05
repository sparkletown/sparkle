import { ListIteratingSystem } from "@ash.ts/ash";
import { AnimationComponent } from "../components/AnimationComponent";
import { AnimationNode } from "../nodes/AnimationNode";

export class AnimationSystem extends ListIteratingSystem<AnimationNode> {
  updateNode(node: AnimationNode, delta: number): void {
    node.animation.animation.animate(delta);

    node.animation.alive -= delta;

    if (node.animation.alive <= 0) {
      node.entity.remove(AnimationComponent);
    }
  }
}
