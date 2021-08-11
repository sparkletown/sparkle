import { Engine, Entity, NodeList, System } from "@ash.ts/ash";

import { GameInstance } from "../../GameInstance";
import { Point } from "../../utils/Point";
import { MotionClickControlComponent } from "../components/MotionClickControlComponent";
import { MotionJoystickControlComponent } from "../components/MotionJoystickControlComponent";
import { MotionKeyboardControlComponent } from "../components/MotionKeyboardControlComponent";
import { MotionTeleportComponent } from "../components/MotionTeleportComponent";
import { MovementComponent } from "../components/MovementComponent";
import { ViewportFollowComponent } from "../components/ViewportFollowComponent";
import { JoystickNode } from "../nodes/JoystickNode";
import { KeyboardNode } from "../nodes/KeyboardNode";
import { MotionControlSwitchNode } from "../nodes/MotionControlSwitchNode";
import { ViewportNode } from "../nodes/ViewportNode";

export class MotionControlSwitchSystem extends System {
  private player: NodeList<MotionControlSwitchNode> | null = null;
  private viewport: NodeList<ViewportNode> | null = null;
  private keyboard: NodeList<KeyboardNode> | null = null;
  private joystick: NodeList<JoystickNode> | null = null;

  private lastViewportClick = 0;

  addToEngine(engine: Engine): void {
    this.player = engine.getNodeList(MotionControlSwitchNode);

    this.keyboard = engine.getNodeList(KeyboardNode);

    this.viewport = engine.getNodeList(ViewportNode);
    this.viewport.nodeAdded.add(this.handleViewportAdded);

    this.joystick = engine.getNodeList(JoystickNode);
    this.joystick.nodeAdded.add(this.handleJoystickAdded);
  }

  removeFromEngine(): void {
    this.removePlayerKeyboardControl();
    this.removePlayerJoystickControl();
    this.removePlayerClickControl();
    this.removePlayerTweenControl();

    this.keyboard = null;
    this.player = null;

    this.viewport?.nodeAdded.remove(this.handleViewportAdded);
    this.viewport = null;

    this.joystick?.nodeAdded.add(this.handleJoystickAdded);
    this.joystick = null;
  }

  update(time: number): void {
    if (!this.getPlayerEntity()) {
      this.removePlayerClickControl();
      this.removePlayerJoystickControl();
      this.removePlayerKeyboardControl();
      this.removePlayerTweenControl();
      return;
    }

    if (
      this.keyboard &&
      this.keyboard.head &&
      (this.keyboard.head.keyboard.hDirection ||
        this.keyboard.head.keyboard.vDirection)
    ) {
      this.removePlayerClickControl();
      this.removePlayerJoystickControl();
      this.removePlayerTweenControl();
      this.setPlayerKeyboardControl();
    } else {
      this.removePlayerKeyboardControl();
    }
  }

  private handleJoystickAdded = (node: JoystickNode): void => {
    if (!this.getPlayerEntity() || !node.joystick.active) {
      return;
    }

    this.removePlayerKeyboardControl();
    this.removePlayerClickControl();
    this.removePlayerTweenControl();
    this.setPlayerJoystickControl();

    this.followThePlayer();
  };

  private handleViewportAdded = (node: ViewportNode): void => {
    const doubleClick = true;

    if (doubleClick) {
      if (node.viewport.click && this.getPlayerEntity()) {
        const time = Date.now();
        if (time - this.lastViewportClick >= 300) {
          this.lastViewportClick = time;
          return;
        }
      } else {
        return;
      }
    } else {
      if (!node.viewport.click || !this.getPlayerEntity()) {
        return;
      }
    }

    this.removePlayerKeyboardControl();
    this.removePlayerClickControl();
    this.removePlayerJoystickControl();
    this.removePlayerTweenControl();

    if (
      node.viewport.zoomLevel ===
      GameInstance.instance.getConfig().speedByZoomLevelArray.length - 1
    ) {
      this.setPlayerTweenControl(node.viewport.click);
    } else {
      this.setPlayerClickControl(node.viewport.click);
    }

    this.followThePlayer();
  };

  private setPlayerTweenControl(e: Point): void {
    const x = e.x;
    const y = e.y;
    if (
      !GameInstance.instance
        .getConfig()
        .playgroundMap.pointIsOnThePlayground(x, y)
    ) {
      // TODO show warning for user
      return;
    }

    const entity: Entity | null = this.getPlayerEntity();
    if (entity && !entity.has(MotionTeleportComponent)) {
      entity.add(new MotionTeleportComponent(x, y));
    }
  }

  private removePlayerTweenControl(): void {
    const entity: Entity | null = this.getPlayerEntity();
    if (entity && entity.has(MotionTeleportComponent)) {
      entity.remove(MotionTeleportComponent);
    }
  }

  private setPlayerClickControl(e: Point): void {
    const x = e.x;
    const y = e.y;

    if (
      !GameInstance.instance
        .getConfig()
        .playgroundMap.pointIsOnThePlayground(x, y)
    ) {
      // TODO show warning for user
      return;
    }

    const entity: Entity | null = this.getPlayerEntity();
    if (entity && !entity.has(MotionClickControlComponent)) {
      entity.add(new MotionClickControlComponent(x, y));
    }
  }

  private removePlayerClickControl(): void {
    const entity: Entity | null = this.getPlayerEntity();
    if (entity && entity.has(MotionClickControlComponent)) {
      entity.remove(MotionClickControlComponent);

      const comp: MovementComponent | null = entity.get(MovementComponent);
      if (comp) {
        comp.velocityX = 0;
        comp.velocityY = 0;
      }
    }
  }

  private setPlayerKeyboardControl(): void {
    const entity: Entity | null = this.getPlayerEntity();
    if (entity && !entity.has(MotionKeyboardControlComponent)) {
      entity.add(new MotionKeyboardControlComponent());
    }
    this.followThePlayer();
  }

  private removePlayerKeyboardControl(): void {
    const entity: Entity | null = this.getPlayerEntity();
    if (entity && entity.has(MotionKeyboardControlComponent)) {
      entity.remove(MotionKeyboardControlComponent);

      const comp: MovementComponent | null = entity.get(MovementComponent);
      if (comp) {
        comp.velocityX = 0;
        comp.velocityY = 0;
      }
    }
  }

  private setPlayerJoystickControl(): void {
    const entity: Entity | null = this.getPlayerEntity();
    if (entity && !entity.has(MotionJoystickControlComponent)) {
      entity.add(new MotionJoystickControlComponent());
    }
  }

  private removePlayerJoystickControl(): void {
    const entity: Entity | null = this.getPlayerEntity();
    if (entity && entity.has(MotionJoystickControlComponent)) {
      entity.remove(MotionJoystickControlComponent);

      const comp: MovementComponent | null = entity.get(MovementComponent);
      if (comp) {
        comp.velocityX = 0;
        comp.velocityY = 0;
      }
    }
  }

  private followThePlayer(): void {
    const entity: Entity | null = this.getPlayerEntity();
    if (entity && !entity.has(ViewportFollowComponent)) {
      entity!.add(new ViewportFollowComponent());
    }
  }

  private getPlayerEntity(): Entity | null {
    if (this.player && this.player.head) {
      return this.player.head.entity;
    }
    return null;
  }
}
