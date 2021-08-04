import { Engine, NodeList } from "@ash.ts/ash";
import { Point } from "types/utility";
import { GameInstance } from "../../GameInstance";
import EntityFactory from "../entities/EntityFactory";
import { MotionBotControlNode } from "../nodes/MotionBotControlNode";
import { MotionBotIdleNode } from "../nodes/MotionBotIdleNode";
import { MotionBaseSystem } from "./MotionBaseSystem";

export class MotionBotSystem extends MotionBaseSystem {
  private botsIdle: NodeList<MotionBotIdleNode> | null = null;
  private botsMotion: NodeList<MotionBotControlNode> | null = null;

  constructor(private creator: EntityFactory) {
    super();
  }

  addToEngine(engine: Engine): void {
    this.botsIdle = engine.getNodeList(MotionBotIdleNode);
    this.botsMotion = engine.getNodeList(MotionBotControlNode);
    this.botsMotion.nodeAdded.add(this.handleBotsMotionAdded);
  }

  removeFromEngine(engine: Engine): void {
    this.botsIdle = null;

    this.botsMotion?.nodeAdded.remove(this.handleBotsMotionAdded);
    this.botsMotion = null;
  }

  update(time: number): void {
    for (
      let idle: MotionBotIdleNode | null | undefined = this.botsIdle?.head;
      idle;
      idle = idle.next
    ) {
      if (idle.bot.realUser) {
        continue;
      }
      if (Math.random() > 0.8) {
        const point: Point = GameInstance.instance
          .getConfig()
          .playgroundMap.getRandomPointInTheCentralCircle();
        // .playgroundMap.getRandomPointOnThePlayground();
        this.creator.updateBotPosition(idle.bot.data, point.x, point.y);
      }
    }

    for (
      let motionBotNode: MotionBotControlNode | null | undefined = this
        .botsMotion?.head;
      motionBotNode;
      motionBotNode = motionBotNode.next
    ) {
      this.updateMotionBotNode(motionBotNode, time);
    }
  }

  private handleBotsMotionAdded = (node: MotionBotControlNode): void => {
    const point: Point = GameInstance.instance
      .getConfig()
      .playgroundMap.getRandomPointInTheCentralCircle();
    // .playgroundMap.getRandomPointOnThePlayground();
    node.click.x = point.x;
    node.click.y = point.y;
    node.click.zoom = this.getRandomZoom();
  };

  public updateMotionBotNode(node: MotionBotControlNode, time: number): void {
    const speed = Math.sqrt(
      node.movement.velocityX * node.movement.velocityX +
        node.movement.velocityY * node.movement.velocityY
    );
    let dx = node.click.x - node.position.x;
    let dy = node.click.y - node.position.y;

    // const defaultSpeed = this.getSpeedByZoomLevel(node.click.zoom);
    const defaultSpeed = this.getSpeedByZoomLevel(0) / 3;

    if (Math.abs(dx) - defaultSpeed <= 0 && Math.abs(dy) - defaultSpeed <= 0) {
      node.position.x = node.click.x;
      node.position.y = node.click.y;
      node.movement.velocityX = 0;
      node.movement.velocityY = 0;
      node.bot.fsm.changeState("idle");
      return;
    }

    const length = Math.sqrt(dx * dx + dy * dy);
    dx /= length;
    dy /= length;

    node.movement.velocityX = dx * (speed === 0 ? defaultSpeed : speed);
    node.movement.velocityY = dy * (speed === 0 ? defaultSpeed : speed);
  }

  private getRandomZoom(): number {
    // const rand = Math.random();
    // if (rand < 0.4) {
    //   return 0;
    // }
    // if (rand < 0.8) {
    //   return 1;
    // }
    return 0;
  }
}
