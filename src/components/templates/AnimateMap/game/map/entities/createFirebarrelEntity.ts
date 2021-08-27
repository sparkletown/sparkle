import { Entity } from "@ash.ts/ash";
import { Sprite } from "pixi.js";

import { GameConfig, GameOptionsFirebarrel } from "../../../configs/GameConfig";
import { ImageToCanvas } from "../../commands/ImageToCanvas";
import { LoadImage } from "../../commands/LoadImage";
import { HALO } from "../../constants/AssetConstants";
import { AnimationComponent } from "../components/AnimationComponent";
import { BarrelComponent } from "../components/BarrelComponent";
import { CollisionComponent } from "../components/CollisionComponent";
import { HoverableSpriteComponent } from "../components/HoverableSpriteComponent";
import { PositionComponent } from "../components/PositionComponent";
import { SpriteComponent } from "../components/SpriteComponent";
import { TooltipComponent } from "../components/TooltipComponent";
import { Barrel } from "../graphics/Barrel";
import { Venue } from "../graphics/Venue";
import { VenueHoverIn } from "../graphics/VenueHoverIn";
import { VenueHoverOut } from "../graphics/VenueHoverOut";

import EntityFactory from "./EntityFactory";

const createTooltip = (entity: Entity) => {
  const collisionRadius = GameConfig.VENUE_DEFAULT_COLLISION_RADIUS / 2;
  const tooltip: TooltipComponent = new TooltipComponent(
    `Join to firebarrel`,
    collisionRadius,
    "bottom"
  );
  tooltip.textColor = 0xffffff;
  tooltip.textSize = 14;
  tooltip.borderThikness = 0;
  tooltip.borderColor = 0;
  tooltip.backgroundColor = 0;
  // add tooltip
  entity.add(tooltip);
};

export const createFirebarrelEntity = (
  barrel: GameOptionsFirebarrel,
  creator: EntityFactory
): Entity => {
  const collisionRadius = GameConfig.VENUE_DEFAULT_COLLISION_RADIUS / 2;

  const entity: Entity = new Entity();
  entity
    .add(new BarrelComponent(barrel))
    .add(new CollisionComponent(collisionRadius))
    .add(
      new HoverableSpriteComponent(
        () => {
          createTooltip(entity);

          // add increase
          const comm: SpriteComponent | null = entity.get(SpriteComponent);
          const duration = 100;
          if (comm) {
            entity.add(
              new AnimationComponent(
                new VenueHoverIn(comm.view as Venue, duration),
                duration
              )
            );
          }
        },
        () => {
          // remove tooltip
          entity.remove(TooltipComponent);
          // add decrease
          const comm: SpriteComponent | null = entity.get(SpriteComponent);
          const duration = 100;
          if (comm) {
            entity.add(
              new AnimationComponent(
                new VenueHoverOut(comm.view as Venue, duration),
                duration
              )
            );
          }
        }
      )
    );

  creator.engine.addEntity(entity);

  new LoadImage(barrel.iconSrc)
    .execute()
    .then(
      (comm: LoadImage): Promise<ImageToCanvas> => {
        if (!comm.image) return Promise.reject();

        // the picture can be very large
        const scale = ((collisionRadius * 2) / comm.image.width) * 2;
        return new ImageToCanvas(comm.image).scaleTo(scale).execute();
      }
    )
    .then((comm: ImageToCanvas) => {
      const scale = (collisionRadius * 2) / comm.canvas.width / 2;
      if (barrel)
        entity.add(new PositionComponent(barrel.x, barrel.y, 0, scale, scale));

      const sprite: Barrel = new Barrel();
      sprite.name = barrel.iconSrc;
      sprite.barrel = Sprite.from(comm.canvas);
      sprite.barrel.anchor.set(0.5);
      sprite.addChild(sprite.barrel);

      sprite.halo = Sprite.from(HALO);
      sprite.halo.anchor.set(0.5);
      sprite.zIndex = -1;
      sprite.addChildAt(sprite.halo, 0);

      const spriteComponent: SpriteComponent = new SpriteComponent();
      spriteComponent.view = sprite;

      entity.add(spriteComponent);
    })
    .catch((err) => {
      // TODO default venue image
      console.log("err", err);
    });

  return entity;
};
