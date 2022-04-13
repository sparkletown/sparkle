import { Engine, Entity, NodeList, System } from "@ash.ts/ash";

import { Point } from "types/utility";

import { GameInstance } from "../../GameInstance";
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
  private player?: NodeList<MotionControlSwitchNode>;
  private viewport?: NodeList<ViewportNode>;
  private keyboard?: NodeList<KeyboardNode>;
  private joystick?: NodeList<JoystickNode>;

  private lastViewportClick = 0;

  addToEngine(engine: Engine) {
    this.player = engine.getNodeList(MotionControlSwitchNode);

    this.keyboard = engine.getNodeList(KeyboardNode);

    this.viewport = engine.getNodeList(ViewportNode);
    this.viewport.nodeAdded.add(this.handleViewportAdded);

    this.joystick = engine.getNodeList(JoystickNode);
    this.joystick.nodeAdded.add(this.handleJoystickAdded);
  }

  removeFromEngine() {
    this.removePlayerKeyboardControl();
    this.removePlayerJoystickControl();
    this.removePlayerClickControl();
    this.removePlayerTweenControl();

    this.keyboard = undefined;
    this.player = undefined;

    this.viewport?.nodeAdded.remove(this.handleViewportAdded);
    this.viewport = undefined;

    this.joystick?.nodeAdded.add(this.handleJoystickAdded);
    this.joystick = undefined;
  }

  update(time: number) {
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

  private handleJoystickAdded = (node: JoystickNode) => {
    if (!this.getPlayerEntity() || !node.joystick.active) {
      return;
    }

    this.removePlayerKeyboardControl();
    this.removePlayerClickControl();
    this.removePlayerTweenControl();
    this.setPlayerJoystickControl();

    this.followThePlayer();
  };

  private handleViewportAdded = (node: ViewportNode) => {
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

  private setPlayerTweenControl(e: Point) {
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

  private removePlayerTweenControl() {
    const entity: Entity | null = this.getPlayerEntity();
    if (entity && entity.has(MotionTeleportComponent)) {
      entity.remove(MotionTeleportComponent);
    }
  }

  private setPlayerClickControl(e: Point) {
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

  private removePlayerClickControl() {
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

  private setPlayerKeyboardControl() {
    const entity: Entity | null = this.getPlayerEntity();
    if (entity && !entity.has(MotionKeyboardControlComponent)) {
      entity.add(new MotionKeyboardControlComponent());
    }
    this.followThePlayer();
  }

  private removePlayerKeyboardControl() {
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

  private setPlayerJoystickControl() {
    const entity: Entity | null = this.getPlayerEntity();
    if (entity && !entity.has(MotionJoystickControlComponent)) {
      entity.add(new MotionJoystickControlComponent());
    }
  }

  private removePlayerJoystickControl() {
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

  private followThePlayer() {
    const entity: Entity | null = this.getPlayerEntity();
    if (entity && !entity.has(ViewportFollowComponent)) {
      entity.add(new ViewportFollowComponent());
    }
  }

  private getPlayerEntity(): Entity | null {
    if (this.player && this.player.head) {
      return this.player.head.entity;
    }
    return null;
  }
}
