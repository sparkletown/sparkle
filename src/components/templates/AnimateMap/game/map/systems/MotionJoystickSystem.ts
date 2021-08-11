import { Engine, NodeList } from "@ash.ts/ash";
import { Container, Graphics, Sprite } from "pixi.js";
import { Joystick, JoystickChangeEvent } from "pixi-virtual-joystick";

import {
  JOYSTICK_HANDLE_IMAGE,
  JOYSTICK_IMAGE,
} from "../../constants/AssetConstants";
import { Easing } from "../../utils/Easing";
import { JoystickComponent } from "../components/JoystickComponent";
import EntityFactory from "../entities/EntityFactory";
import { JoystickNode } from "../nodes/JoystickNode";
import { MotionJoystickControlNode } from "../nodes/MotionJoystickControlNode";
import { MotionKeyboardControlNode } from "../nodes/MotionKeyboardControlNode";
import { ViewportNode } from "../nodes/ViewportNode";

import { MotionBaseSystem } from "./MotionBaseSystem";

export class MotionJoystickSystem extends MotionBaseSystem {
  private joystick: NodeList<JoystickNode> | null = null;
  private motionJoystickControl: NodeList<MotionJoystickControlNode> | null = null;
  private motionKeyboardControl: NodeList<MotionKeyboardControlNode> | null = null;

  private _container: Container;
  private _joystick: Joystick;
  private _outer: Graphics;
  private _inner: Sprite;
  private easingX: Easing | null = null;
  private easingY: Easing | null = null;

  constructor(container: Container, private entityFactory: EntityFactory) {
    super();

    this._container = container;

    const background = Sprite.from(JOYSTICK_IMAGE);
    background.anchor.set(0.5);
    this._container.addChild(background);

    this._outer = new Graphics();
    this._outer.beginFill(0x000000);
    this._outer.drawCircle(0, 0, background.width / 3);
    this._outer.alpha = 0;

    this._inner = Sprite.from(JOYSTICK_HANDLE_IMAGE);
    this._inner.anchor.set(0.5);
    const inner = new Container();
    inner.addChild(this._inner);

    this._joystick = new Joystick({
      outer: this._outer,
      inner: inner,
      onChange: (e: JoystickChangeEvent) => this._onJoystickChange(e),
      onStart: () => this._onJoystickStart(),
      onEnd: () => this._onJoystickEnd(),
    });
    this._joystick.innerAlphaStandby = 1;

    this._container?.addChild(this._joystick);
  }

  addToEngine(engine: Engine): void {
    this.motionJoystickControl = engine.getNodeList(MotionJoystickControlNode);
    this.motionKeyboardControl = engine.getNodeList(MotionKeyboardControlNode);
    this.viewport = engine.getNodeList(ViewportNode);
    this.joystick = engine.getNodeList(JoystickNode);

    this.entityFactory.createJoystick(new JoystickComponent());
  }

  removeFromEngine(engine: Engine): void {
    this.joystick = null;
    this.motionJoystickControl = null;
    this.motionKeyboardControl = null;
    this.viewport = null;
  }

  update(time: number) {
    if (this.easingY) {
      this.easingY.update(time);
    }
    if (this.easingX) {
      this.easingX.update(time);
    }
    if (!this.joystick || !this.joystick.head) {
      return;
    }

    if (
      this.motionJoystickControl &&
      this.motionJoystickControl.head &&
      this.joystick.head.joystick.active
    ) {
      this.easingX = null;
      this.easingY = null;
      // move hero
      const speed = this.getSpeed();
      const angle = this.joystick.head.joystick.angle;
      const power = this.joystick.head.joystick.power;

      for (
        let node: MotionJoystickControlNode | null | undefined = this
          .motionJoystickControl.head;
        node;
        node = node.next
      ) {
        node.movement.velocityX =
          speed * Math.cos(angle * (Math.PI / 180)) * power;
        node.movement.velocityY =
          -speed * Math.sin(angle * (Math.PI / 180)) * power;
      }
    } else if (this.motionKeyboardControl && this.motionKeyboardControl.head) {
      // hero is moved by WASD?
      for (
        let node: MotionKeyboardControlNode | null | undefined = this
          .motionKeyboardControl.head;
        node;
        node = node.next
      ) {
        let x =
          node.movement.velocityX === 0
            ? 0
            : node.movement.velocityX > 0
            ? 1
            : -1;
        let y =
          node.movement.velocityY === 0
            ? 0
            : node.movement.velocityY > 0
            ? 1
            : -1;

        const delta = this._outer.width * 0.42;
        const k = x !== 0 && y !== 0 ? 0.825 : 1;
        const time = 100;

        x *= delta * k;
        y *= delta * k;

        if (!this.easingX || this.easingX.endValue !== x) {
          this.easingX = new Easing(this._inner.position.x, x, time);
          this.easingX.onComplete = () => {
            this.easingX = null;
          };

          this.easingX.onStep = (value: number) => {
            this._inner.position.x = value;
          };
        }

        if (!this.easingY || this.easingY.endValue !== y) {
          this.easingY = new Easing(this._inner.position.y, y, time);
          this.easingY.onComplete = () => {
            this.easingY = null;
          };

          this.easingY.onStep = (value: number) => {
            this._inner.position.y = value;
          };
        }
      }
    }
  }

  private _onJoystickChange(data: JoystickChangeEvent): void {
    if (this.joystick && this.joystick.head) {
      this.joystick.head.joystick.active = true;
      this.joystick.head.joystick.angle = data.angle;
      this.joystick.head.joystick.power = data.power;
    }
  }

  private _onJoystickStart(): void {
    if (this.joystick && this.joystick.head) {
      this.joystick.head.joystick.active = true;
      this.joystick.head.joystick.angle = 0;
      this.joystick.head.joystick.power = 0;

      this.entityFactory.updateJoystick();
    }
  }

  private _onJoystickEnd(): void {
    if (this.joystick && this.joystick.head) {
      this.joystick.head.joystick.active = true;
      this.joystick.head.joystick.angle = 0;
      this.joystick.head.joystick.power = 0;
    }

    for (
      let node: MotionJoystickControlNode | null | undefined = this
        .motionJoystickControl?.head;
      node;
      node = node.next
    ) {
      node.movement.velocityX = 0;
      node.movement.velocityY = 0;
    }
  }
}
