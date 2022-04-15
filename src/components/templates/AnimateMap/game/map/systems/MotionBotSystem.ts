import { Engine, NodeList } from "@ash.ts/ash";

import { GameControls, GamePoint } from "../../common";
import EntityFactory from "../entities/EntityFactory";
import { MotionBotControlNode } from "../nodes/MotionBotControlNode";
import { MotionBotIdleNode } from "../nodes/MotionBotIdleNode";

import { MotionBaseSystem } from "./MotionBaseSystem";

export class MotionBotSystem extends MotionBaseSystem {
  private botsIdle?: NodeList<MotionBotIdleNode>;
  private botsMotion?: NodeList<MotionBotControlNode>;

  constructor(
    protected _controls: GameControls,
    private creator: EntityFactory
  ) {
    super(_controls);
  }

  addToEngine(engine: Engine) {
    this.botsIdle = engine.getNodeList(MotionBotIdleNode);
    this.botsMotion = engine.getNodeList(MotionBotControlNode);
    this.botsMotion.nodeAdded.add(this.handleBotsMotionAdded);
  }

  removeFromEngine(engine: Engine) {
    this.botsIdle = undefined;

    this.botsMotion?.nodeAdded.remove(this.handleBotsMotionAdded);
    this.botsMotion = undefined;
  }

  update(time: number) {
    for (
      let idle: MotionBotIdleNode | null | undefined = this.botsIdle?.head;
      idle;
      idle = idle.next
    ) {
      if (idle.bot.realUser) {
        continue;
      }
      if (Math.random() > 0.8) {
        const point: GamePoint = this._controls.playgroundMap.getRandomPointInTheCentralCircle();
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

  private handleBotsMotionAdded = (node: MotionBotControlNode) => {
    const point: GamePoint = this._controls.playgroundMap.getRandomPointInTheCentralCircle();
    node.click.x = point.x;
    node.click.y = point.y;
    node.click.zoom = this.getRandomZoom();
  };

  public updateMotionBotNode(node: MotionBotControlNode, time: number) {
    let speed = Math.sqrt(
      node.movement.velocityX * node.movement.velocityX +
        node.movement.velocityY * node.movement.velocityY
    );
    let dx = node.click.x - node.position.x;
    let dy = node.click.y - node.position.y;

    let defaultSpeed;
    const ticks = 80;
    if (!node.bot.realUser) defaultSpeed = this.getSpeedByZoomLevel(0) / 3;
    else {
      const distance = Math.sqrt(
        Math.pow(node.click.x - node.position.x, 2) +
          Math.pow(node.click.y - node.position.y, 2)
      );
      speed = defaultSpeed = distance / ticks;
      if (speed < 1) defaultSpeed = speed = 1;
    }

    if (Math.abs(dx) - defaultSpeed <= 0 && Math.abs(dy) - defaultSpeed <= 0) {
      node.position.x = node.click.x;
      node.position.y = node.click.y;
      node.movement.velocityX = 0;
      node.movement.velocityY = 0;
      node.bot.fsm.changeState(node.bot.IDLE);
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
