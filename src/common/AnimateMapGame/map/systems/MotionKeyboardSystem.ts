import { Engine, NodeList } from "@ash.ts/ash";

import { GameControls } from "../../common";
import { KeyPollSingleton } from "../../utils/KeyPollSingleton";
import { KeyboardComponent } from "../components/KeyboardComponent";
import { MotionKeyboardControlComponent } from "../components/MotionKeyboardControlComponent";
import EntityFactory from "../entities/EntityFactory";
import { KeyboardNode } from "../nodes/KeyboardNode";
import { MotionKeyboardControlNode } from "../nodes/MotionKeyboardControlNode";
import { ViewportNode } from "../nodes/ViewportNode";

import { MotionBaseSystem } from "./MotionBaseSystem";

export class MotionKeyboardSystem extends MotionBaseSystem {
  private keyboard?: NodeList<KeyboardNode>;
  private keyboardControl?: NodeList<MotionKeyboardControlNode>;

  constructor(
    protected _controls: GameControls,
    private keyPoll: KeyPollSingleton,
    private entityFactory: EntityFactory
  ) {
    super(_controls);
  }

  addToEngine(engine: Engine) {
    this.keyboard = engine.getNodeList(KeyboardNode);
    this.keyboardControl = engine.getNodeList(MotionKeyboardControlNode);
    this.viewport = engine.getNodeList(ViewportNode);

    this.entityFactory.createKeyboard(
      new KeyboardComponent(),
      new MotionKeyboardControlComponent()
    );
  }

  removeFromEngine(engine: Engine) {
    this.keyboard = undefined;
    this.keyboardControl = undefined;
    this.viewport = undefined;
  }

  update(time: number) {
    if (document.activeElement instanceof HTMLInputElement) {
      return;
    }

    if (!this.keyboard || !this.keyboard.head) {
      return;
    }

    if (this.isDown(this.keyboard.head.control.left)) {
      this.keyboard.head.keyboard.hDirection = -1;
    } else if (this.isDown(this.keyboard.head.control.right)) {
      this.keyboard.head.keyboard.hDirection = 1;
    } else {
      this.keyboard.head.keyboard.hDirection = 0;
    }

    if (this.isDown(this.keyboard.head.control.down)) {
      this.keyboard.head.keyboard.vDirection = 1;
    } else if (this.isDown(this.keyboard.head.control.up)) {
      this.keyboard.head.keyboard.vDirection = -1;
    } else {
      this.keyboard.head.keyboard.vDirection = 0;
    }

    if (!this.keyboardControl || !this.keyboardControl.head) {
      return;
    }

    let speed = this.getSpeed();
    speed *=
      this.keyboard.head.keyboard.hDirection !== 0 &&
      this.keyboard.head.keyboard.vDirection !== 0
        ? 0.851
        : 1;

    for (
      let node: MotionKeyboardControlNode | null | undefined = this
        .keyboardControl.head;
      node;
      node = node.next
    ) {
      node.movement.velocityX = this.keyboard.head.keyboard.hDirection * speed;
      node.movement.velocityY = this.keyboard.head.keyboard.vDirection * speed;
    }
  }

  private isDown(keys: Array<number>): boolean {
    for (let i = 0; i < keys.length; i++) {
      if (this.keyPoll.isDown(keys[i])) {
        return true;
      }
    }
    return false;
  }
}
