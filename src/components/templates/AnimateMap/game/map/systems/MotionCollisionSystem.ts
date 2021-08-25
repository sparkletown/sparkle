import { Engine, NodeList, System } from "@ash.ts/ash";

import { EventType } from "../../../bridges/EventProvider/EventProvider";
import { ShowTooltipClickEnter } from "../../commands/ShowTooltipClickEnter";
import { GameInstance } from "../../GameInstance";
import { CollisionComponent } from "../components/CollisionComponent";
import { PositionComponent } from "../components/PositionComponent";
import { BarrelNode } from "../nodes/BarrelNode";
import { MotionCollidedNode } from "../nodes/MotionCollidedNode";
import { PlayerNode } from "../nodes/PlayerNode";
import { VenueNode } from "../nodes/VenueNode";

export class MotionCollisionSystem extends System {
  private player?: NodeList<PlayerNode>;
  private colliders?: NodeList<MotionCollidedNode>;
  private venues?: NodeList<VenueNode>;
  private barrels?: NodeList<BarrelNode>;

  addToEngine(engine: Engine) {
    this.player = engine.getNodeList(PlayerNode);
    this.colliders = engine.getNodeList(MotionCollidedNode);
    this.venues = engine.getNodeList(VenueNode);
    this.barrels = engine.getNodeList(BarrelNode);
  }

  removeFromEngine(engine: Engine) {
    this.player = undefined;
    this.colliders = undefined;
    this.venues = undefined;
    this.barrels = undefined;
  }

  update(time: number) {
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
          this.collideObject(
            this.colliders.head,
            previousX,
            previousY,
            node.position,
            node.collision
          )
        ) {
          new ShowTooltipClickEnter(node).execute();

          GameInstance.instance.eventProvider.emit(
            EventType.ON_VENUE_COLLISION,
            node.venue.model
          );
          break;
        }
      }

      for (
        let barrelNode = this.barrels?.head;
        barrelNode;
        barrelNode = barrelNode.next
      ) {
        if (
          this.collideObject(
            this.colliders.head,
            previousX,
            previousY,
            barrelNode.position,
            barrelNode.collision
          )
        ) {
          console.log("collide firebarrel");
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

  public collideObject(
    player: MotionCollidedNode,
    previousX: number,
    previousY: number,
    position: PositionComponent,
    collision: CollisionComponent
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
    const dx = player.position.x - position.x;
    const dy = player.position.y - position.y;
    let dotProduct =
      player.movement.velocityX * dx + player.movement.velocityY * dy;
    dotProduct =
      dotProduct > 0 ? -1 * dotProduct : dotProduct === 0 ? -0.001 : dotProduct;

    outerLimit = collision.radius + player.collision.radius;
    if (Math.abs(dx) > outerLimit) return false;
    if (Math.abs(dy) > outerLimit) return false;
    distanceSq = dx * dx + dy * dy;
    outerLimitSq = outerLimit * outerLimit;
    if (distanceSq > outerLimitSq) return false;

    pdx = previousX - position.x;
    pdy = previousY - position.y;
    pDistanceSq = pdx * pdx + pdy * pdy;
    if (pDistanceSq > outerLimitSq) {
      adjustSpeed = ((1 + bounce) * dotProduct) / distanceSq;
      player.movement.velocityX -= adjustSpeed * dx;
      player.movement.velocityY -= adjustSpeed * dy;
      distance = Math.sqrt(distanceSq);
      positionRatio = (2 * outerLimit - distance) / distance + epsilon;
      player.position.x = position.x + dx * positionRatio;
      player.position.y = position.y + dy * positionRatio;
      return true;
    }

    return false;
  }
}
