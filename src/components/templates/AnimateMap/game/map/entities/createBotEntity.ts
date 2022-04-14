import { Entity } from "@ash.ts/ash";
import { Sprite } from "pixi.js";

import { ReplicatedUser } from "store/reducers/AnimateMap";

import { Point } from "types/utility";

import { EventType } from "../../../bridges/EventProvider/EventProvider";
import { RoundAvatar } from "../../commands/RoundAvatar";
import { GameInstance } from "../../GameInstance";
import { BotComponent } from "../components/BotComponent";
import { ClickableSpriteComponent } from "../components/ClickableSpriteComponent";
import { HoverableSpriteComponent } from "../components/HoverableSpriteComponent";
import { MotionBotClickControlComponent } from "../components/MotionBotClickControlComponent";
import { MotionBotIdleComponent } from "../components/MotionBotIdleComponent";
import { MovementComponent } from "../components/MovementComponent";
import { PositionComponent } from "../components/PositionComponent";
import { SpriteComponent } from "../components/SpriteComponent";
import { TooltipComponent } from "../components/TooltipComponent";
import { FSMBase } from "../finalStateMachines/FSMBase";
import { Avatar } from "../graphics/Avatar";

import EntityFactory from "./EntityFactory";

export const createBotEntity = (
  user: ReplicatedUser,
  creator: EntityFactory,
  realUser = false
) => {
  const point: Point = GameInstance.instance.playgroundMap.getRandomPointInTheCentralCircle();

  if (!realUser) {
    user.x = point.x;
    user.y = point.y;
  }

  const scale = 0.36;

  const entity: Entity = new Entity();
  const fsm: FSMBase = new FSMBase(entity);
  const bot = new BotComponent(user, fsm, realUser);
  const sprite: Avatar = new Avatar();
  const spriteComponent: SpriteComponent = new SpriteComponent();
  spriteComponent.view = sprite;

  fsm.createState(bot.IMMOBILIZED);

  fsm
    .createState(bot.IDLE)
    .add(MotionBotIdleComponent)
    .withInstance(new MotionBotIdleComponent());

  fsm
    .createState(bot.MOVING)
    .add(MotionBotClickControlComponent)
    .add(MovementComponent)
    .withInstance(new MovementComponent());

  entity
    .add(bot)
    .add(new PositionComponent(user.x, user.y, 0, scale, scale))
    .add(
      new ClickableSpriteComponent((event) => {
        const replicatedUser = creator.getBotNode(user.data.id)?.bot.data;
        if (!replicatedUser || !realUser) return;
        GameInstance.instance.eventProvider.emit(
          EventType.ON_REPLICATED_USER_CLICK,
          replicatedUser,
          event.data.global.x,
          event.data.global.y
        );
      })
    )
    .add(
      new HoverableSpriteComponent(
        () => {
          // add tooltip
          entity.add(new TooltipComponent(`${user.data.partyName}`, 15, "top"));
        },
        () => {
          // remove tooltip
          entity.remove(TooltipComponent);
        }
      )
    );

  fsm.changeState("moving");
  creator.engine.addEntity(entity);

  const pictureUrls = [user.data.pictureUrl]; //todo: refactor
  // if (!Array.isArray(pictureUrls)) {
  //   pictureUrls = [pictureUrls];
  // }
  const url = pictureUrls.length > 0 ? pictureUrls[0] : "";

  new RoundAvatar(url)
    .execute()
    .then((comm: RoundAvatar) => {
      if (!comm.canvas) return Promise.reject();

      // avatar
      sprite.avatar = Sprite.from(comm.canvas);
      sprite.avatar.anchor.set(0.5);
      sprite.addChild(sprite.avatar);
      return Promise.resolve(comm);
    })
    .then((comm: RoundAvatar) => {
      if (!comm.canvas) return Promise.reject();

      entity.add(spriteComponent);
    });

  return entity;
};
