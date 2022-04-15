import { Entity } from "@ash.ts/ash";
import { Sprite } from "pixi.js";

import { ReplicatedFirebarrel } from "store/reducers/AnimateMap";

import { ImageToCanvas } from "../../commands/ImageToCanvas";
import { LoadImage } from "../../commands/LoadImage";
import { GameConfig } from "../../common";
import { barrels } from "../../constants/AssetConstants";
import { AnimationComponent } from "../components/AnimationComponent";
import { ClickableSpriteComponent } from "../components/ClickableSpriteComponent";
import { CollisionComponent } from "../components/CollisionComponent";
import { FirebarrelComponent } from "../components/FirebarrelComponent";
import { HoverableSpriteComponent } from "../components/HoverableSpriteComponent";
import { PositionComponent } from "../components/PositionComponent";
import { SpriteComponent } from "../components/SpriteComponent";
import { TooltipComponent } from "../components/TooltipComponent";
import { FSMBase } from "../finalStateMachines/FSMBase";
import { Firebarrel } from "../graphics/Firebarrel";
import { FirebarrelCamIcon } from "../graphics/FirebarrelCamIcon";
import { FirebarrelHalo } from "../graphics/FirebarrelHalo";
import { FirebarrelHaloAnimated } from "../graphics/FirebarrelHaloAnimated";
import { FirebarrelHaloEmpty } from "../graphics/FirebarrelHaloEmpty";
import { FirebarrelShouter } from "../graphics/FirebarrelShouter";
import { FirebarrelTooltip } from "../graphics/FirebarrelTooltip";
import { HoverIn } from "../graphics/HoverIn";
import { HoverOut } from "../graphics/HoverOut";
import { Venue } from "../graphics/Venue";

import EntityFactory from "./EntityFactory";

const getCollisionRadius = (config: GameConfig): number => {
  return config.VENUE_DEFAULT_COLLISION_RADIUS / 2;
};

const createTooltip = (entity: Entity, text: string = "Join") => {
  const tooltip = new TooltipComponent("", 0, "center");
  tooltip.view = new FirebarrelTooltip(text);
  entity.add(tooltip);
};

const removeTooltip = (entity: Entity) => {
  entity.remove(TooltipComponent);
};

const getCurrentReplicatedFirebarrel = (
  firebarrelComponent: FirebarrelComponent
): ReplicatedFirebarrel => {
  return firebarrelComponent.model;
};

const updateBarrelImage = (
  barrel: ReplicatedFirebarrel,
  spriteComponent: SpriteComponent,
  positionComponent: PositionComponent,
  config: GameConfig
): Promise<void> => {
  return new LoadImage(barrel.data.iconSrc)
    .execute()
    .catch((error) => {
      return new LoadImage(barrels[0]).execute();
    })
    .then(
      (comm: LoadImage): Promise<ImageToCanvas> => {
        if (!comm.image) return Promise.reject();

        // the picture can be very large
        const scale = ((getCollisionRadius(config) * 2) / comm.image.width) * 2;
        return new ImageToCanvas(comm.image).scaleTo(scale).execute();
      }
    )
    .then((comm: ImageToCanvas) => {
      const scale = (getCollisionRadius(config) * 2) / comm.canvas.width / 2;
      positionComponent.scaleX = scale;
      positionComponent.scaleY = scale;

      const sprite = spriteComponent.view as Firebarrel;
      if (sprite.main && sprite.main.parent) {
        sprite.main.parent.removeChild(sprite.main);
      }

      sprite.main = Sprite.from(comm.canvas);
      sprite.main.anchor.set(0.5);
      sprite.addChild(sprite.main);
      return Promise.resolve();
    })
    .catch((err) => {
      console.log("err", err);
    })
    .finally(() => {
      return Promise.resolve();
    });
};

export const updateFirebarrelEntity = (
  barrel: ReplicatedFirebarrel,
  creator: EntityFactory
) => {
  const node = creator.getFirebarrelNode(barrel.data.id);
  if (!node) {
    return;
  }

  node.firebarrel.model = barrel;
  node.entity.add(node.firebarrel);

  const spriteComponent = node.entity.get(SpriteComponent);
  if (!spriteComponent) {
    return;
  }

  updateBarrelImage(
    barrel,
    spriteComponent,
    node.position,
    creator.controls.getConfig()
  );
};

export const createFirebarrelEntity = (
  barrel: ReplicatedFirebarrel,
  creator: EntityFactory
): Entity => {
  const engine = creator.engine;
  const entity: Entity = new Entity();
  const fsm: FSMBase = new FSMBase(entity);

  const shouterTimeOut = 250 * 6 + Math.random() * 120;
  const shouterCurrentTime = shouterTimeOut * Math.random();
  const shouter = new FirebarrelShouter(shouterTimeOut, shouterCurrentTime);
  const barrelComponent = new FirebarrelComponent(barrel, fsm);
  const positionComponent = new PositionComponent(barrel.x, barrel.y);
  const spriteComponent = new SpriteComponent();
  const sprite = new Firebarrel();
  spriteComponent.view = sprite;
  spriteComponent.view.zIndex = -1;

  fsm
    .createState(barrelComponent.WITHOUT_HALO)
    .add(FirebarrelHaloEmpty)
    .withMethod(
      (): FirebarrelHaloEmpty => {
        return new FirebarrelHaloEmpty(sprite);
      }
    );
  fsm
    .createState(barrelComponent.HALO)
    .add(FirebarrelHalo)
    .withMethod(
      (): FirebarrelHalo => {
        return new FirebarrelHalo(sprite);
      }
    );

  fsm
    .createState(barrelComponent.HALO_ANIMATED)
    .add(AnimationComponent)
    .withMethod(
      (): AnimationComponent => {
        return new AnimationComponent(
          new FirebarrelHaloAnimated(sprite),
          Number.MAX_VALUE
        );
      }
    );

  let hoverEffectEntity: Entity;
  const hoverEffectDuration = 100;

  entity
    .add(barrelComponent)
    .add(
      new CollisionComponent(getCollisionRadius(creator.controls.getConfig()))
    )
    .add(positionComponent)
    .add(spriteComponent)
    .add(new FirebarrelCamIcon(spriteComponent.view))
    .add(shouter)
    .add(
      new HoverableSpriteComponent(
        () => {
          createTooltip(entity);

          // add increase
          const comm = entity.get(SpriteComponent);
          if (comm) {
            if (hoverEffectEntity) {
              engine.removeEntity(hoverEffectEntity);
            }
            hoverEffectEntity = new Entity();
            hoverEffectEntity.add(
              new AnimationComponent(
                new HoverIn(comm.view as Venue, hoverEffectDuration),
                hoverEffectDuration
              )
            );
            engine.addEntity(hoverEffectEntity);
          }
        },
        () => {
          // remove tooltip
          removeTooltip(entity);
          // add decrease
          const comm = entity.get(SpriteComponent);
          if (comm) {
            if (hoverEffectEntity) {
              engine.removeEntity(hoverEffectEntity);
            }
            hoverEffectEntity = new Entity();
            hoverEffectEntity.add(
              new AnimationComponent(
                new HoverOut(comm.view as Venue, hoverEffectDuration),
                hoverEffectDuration
              )
            );
            engine.addEntity(hoverEffectEntity);
          }
        }
      )
    )
    .add(
      new ClickableSpriteComponent(() => {
        creator.enterFirebarrel(
          getCurrentReplicatedFirebarrel(barrelComponent).data.id
        );
      })
    );

  fsm.changeState(barrelComponent.HALO);
  creator.engine.addEntity(entity);

  spriteComponent.view.visible = false;
  updateBarrelImage(
    barrel,
    spriteComponent,
    positionComponent,
    creator.controls.getConfig()
  ).finally(() => {
    if (spriteComponent && spriteComponent.view) {
      spriteComponent.view.visible = true;
    }
  });

  return entity;
};
