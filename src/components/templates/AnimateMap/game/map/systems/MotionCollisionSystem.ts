import { Engine, NodeList, System } from "@ash.ts/ash";

import { ReplicatedVenue } from "store/reducers/AnimateMap";

import { EventType } from "../../../bridges/EventProvider/EventProvider";
import { GameControls } from "../../common";
import { GameInstance } from "../../GameInstance";
import { CollisionComponent } from "../components/CollisionComponent";
import { MovementComponent } from "../components/MovementComponent";
import { PositionComponent } from "../components/PositionComponent";
import EntityFactory from "../entities/EntityFactory";
import { ArtcarNode } from "../nodes/ArtcarNode";
import { FirebarrelNode } from "../nodes/FirebarrelNode";
import { MotionCollidedNode } from "../nodes/MotionCollidedNode";
import { PlayerNode } from "../nodes/PlayerNode";
import { VenueNode } from "../nodes/VenueNode";

export class MotionCollisionSystem extends System {
  private player?: NodeList<PlayerNode>;
  private colliders?: NodeList<MotionCollidedNode>;
  private venues?: NodeList<VenueNode>;
  private artcars?: NodeList<ArtcarNode>;
  private barrels?: NodeList<FirebarrelNode>;

  constructor(private _controls: GameControls, private creator: EntityFactory) {
    super();
  }

  addToEngine(engine: Engine) {
    this.player = engine.getNodeList(PlayerNode);
    this.colliders = engine.getNodeList(MotionCollidedNode);
    this.venues = engine.getNodeList(VenueNode);
    this.artcars = engine.getNodeList(ArtcarNode);
    this.barrels = engine.getNodeList(FirebarrelNode);
  }

  removeFromEngine(engine: Engine) {
    this.player = undefined;
    this.colliders = undefined;
    this.venues = undefined;
    this.artcars = undefined;
    this.barrels = undefined;
  }

  update(time: number) {
    if (!this.colliders || !this.colliders.head) {
      return;
    }

    if (
      this.colliders.head.movement.velocityX === 0 &&
      this.colliders.head.movement.velocityY === 0
    ) {
      for (let node = this.artcars?.head; node; node = node?.next) {
        if (this.artcarHittingOnThePlayer(node, this.colliders?.head)) {
          this.creator.createWaitingArtcarClick(node.artcar.artcar);

          GameInstance.instance.eventProvider.emit(
            EventType.ON_VENUE_COLLISION,
            node.artcar.artcar as ReplicatedVenue
          );

          break;
        }
      }
    } else {
      if (
        this.collidePlaygroudnBounds(
          time,
          this.colliders.head.position,
          this.colliders.head.movement
        )
      ) {
        return;
      }

      const currentPosition = this.colliders.head.position;
      const previousX =
        currentPosition.x - this.colliders.head.movement.velocityX * time;
      const previousY =
        currentPosition.y - this.colliders.head.movement.velocityY * time;

      if (this.player && this.player.head) {
        this._controls.playgroundMap.pointIsOnThePlayground(
          this.player.head.position.x,
          this.player.head.position.y
        );
      }

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
          this.creator.createWaitingVenueClick(node.venue.model);

          GameInstance.instance.eventProvider.emit(
            EventType.ON_VENUE_COLLISION,
            node.venue.model
          );
          break;
        }
      }

      for (let node = this.artcars?.head; node; node = node.next) {
        if (
          this.collideObject(
            this.colliders.head,
            previousX,
            previousY,
            node.position,
            node.collision
          )
        ) {
          this.creator.createWaitingArtcarClick(node.artcar.artcar);

          // GameInstance.instance.eventProvider.emit(
          //     EventType.ON_VENUE_COLLISION,
          //     node.venue.model
          // );
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
  }

  public collidePlaygroudnBounds(
    time: number,
    position: PositionComponent,
    movement: MovementComponent
  ): boolean {
    time *= 2;
    const nextX = position.x + movement.velocityX * time;
    const nextY = position.y + movement.velocityY * time;

    if (
      this._controls.playgroundMap.pointIsInTheOuterCircle(
        position.x,
        position.y
      )
    ) {
      return false;
    }

    if (this._controls.playgroundMap.pointIsOnThePlayground(nextX, nextY)) {
      return false;
    }

    const previousX = position.x - movement.velocityX * time;
    const previousY = position.y - movement.velocityY * time;

    const boundingCollide = this._controls.playgroundMap.getPointIfBoundingPlaygroundBorder(
      previousX,
      previousY,
      nextX,
      nextY
    );
    if (boundingCollide) {
      position.x = boundingCollide.x;
      position.y = boundingCollide.y;
      return true;
    }

    return false;
  }

  public collideBoundingBox(player: MotionCollidedNode): boolean {
    const left = 100;
    const top = 100;
    const right = this._controls.getConfig().worldWidth - left;
    const bottom = this._controls.getConfig().worldWidth - top;

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

  private artcarHittingOnThePlayer(
    artcarNode: ArtcarNode,
    playerNode: MotionCollidedNode
  ): boolean {
    const x1 = artcarNode.position.x;
    const y1 = artcarNode.position.y;
    const x2 = playerNode.position.x;
    const y2 = playerNode.position.y;
    const distance = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
    return distance <= artcarNode.collision.radius;
  }

  private collideObject(
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
