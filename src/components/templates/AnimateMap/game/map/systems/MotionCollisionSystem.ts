import { Engine, NodeList, System } from "@ash.ts/ash";

import { EventType } from "../../../bridges/EventProvider/EventProvider";
import { GameInstance } from "../../GameInstance";
import { MotionCollidedNode } from "../nodes/MotionCollidedNode";
import { PlayerNode } from "../nodes/PlayerNode";
import { VenueNode } from "../nodes/VenueNode";

export class MotionCollisionSystem extends System {
  private player: NodeList<PlayerNode> | null = null;
  private colliders: NodeList<MotionCollidedNode> | null = null;
  private venues: NodeList<VenueNode> | null = null;

  addToEngine(engine: Engine): void {
    this.player = engine.getNodeList(PlayerNode);
    this.colliders = engine.getNodeList(MotionCollidedNode);
    this.venues = engine.getNodeList(VenueNode);
  }

  removeFromEngine(engine: Engine): void {
    this.player = null;
    this.colliders = null;
    this.venues = null;
  }

  update(time: number): void {
    if (
      this.colliders &&
      this.colliders.head &&
      (this.colliders.head.movement.velocityX !== 0 ||
        this.colliders.head.movement.velocityY !== 0)
    ) {
      const previousX =
        this.colliders.head.position.x -
        this.colliders.head.movement.velocityX * time;
      const previousY =
        this.colliders.head.position.y -
        this.colliders.head.movement.velocityY * time;
      for (
        let node: VenueNode | null | undefined = this.venues?.head;
        node;
        node = node.next
      ) {
        if (
          this.collideVenue(this.colliders.head, previousX, previousY, node)
        ) {
          GameInstance.instance.eventProvider.emit(
            EventType.ON_VENUE_COLLISION,
            node.venue.model
          );
          break;
        }
      }
    }

    if (this.player && this.player.head) {
      GameInstance.instance
        .getConfig()
        .playgroundMap.pointIsOnThePlayground(
          this.player.head.position.x,
          this.player.head.position.y
        );
    }
  }

  public collideBoundingBox(player: MotionCollidedNode): boolean {
    const left = 100;
    const top = 100;
    const right = GameInstance.instance.getConfig().worldWidth - left;
    const bottom = GameInstance.instance.getConfig().worldWidth - top;

    let collide = false;
    if (player.position.x < left) {
      collide = true;
      player.position.x = left;
    } else if (player.position.x > right) {
      collide = true;
      player.position.x = right;
    }

    if (player.position.y < top) {
      collide = true;
      player.position.y = top;
    } else if (player.position.y > bottom) {
      collide = true;
      player.position.y = bottom;
    }

    return collide;
  }

  public collideVenue(
    player: MotionCollidedNode,
    previousX: number,
    previousY: number,
    venue: VenueNode
  ): boolean {
    const bounce = 1;

    let outerLimit = 0;
    let outerLimitSq = 0;
    let distanceSq = 0;
    let distance = 0;
    let pdx = 0;
    let pdy = 0;
    let pDistanceSq = 0;
    let adjustSpeed = 0;
    let positionRatio = 0;
    const epsilon = 0.001;
    const dx = player.position.x - venue.position.x;
    const dy = player.position.y - venue.position.y;
    let dotProduct =
      player.movement.velocityX * dx + player.movement.velocityY * dy;
    dotProduct =
      dotProduct > 0 ? -1 * dotProduct : dotProduct === 0 ? -0.001 : dotProduct;

    outerLimit = venue.collision.radius + player.collision.radius;
    if (Math.abs(dx) > outerLimit) return false;
    if (Math.abs(dy) > outerLimit) return false;
    distanceSq = dx * dx + dy * dy;
    outerLimitSq = outerLimit * outerLimit;
    if (distanceSq > outerLimitSq) return false;

    pdx = previousX - venue.position.x;
    pdy = previousY - venue.position.y;
    pDistanceSq = pdx * pdx + pdy * pdy;
    if (pDistanceSq > outerLimitSq) {
      adjustSpeed = ((1 + bounce) * dotProduct) / distanceSq;
      player.movement.velocityX -= adjustSpeed * dx;
      player.movement.velocityY -= adjustSpeed * dy;
      distance = Math.sqrt(distanceSq);
      positionRatio = (2 * outerLimit - distance) / distance + epsilon;
      player.position.x = venue.position.x + dx * positionRatio;
      player.position.y = venue.position.y + dy * positionRatio;
      return true;
    }

    return false;
  }
}
