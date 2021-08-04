import { ListIteratingSystem } from "@ash.ts/ash";
import { MovementNode } from "../nodes/MovementNode";

export class MovementSystem extends ListIteratingSystem<MovementNode> {
  public constructor() {
    super(MovementNode);
  }

  public updateNode(node: MovementNode, time: number): void {
    const { position, movement } = node;

    position.x += movement.velocityX * time;
    position.y += movement.velocityY * time;
  }
}
