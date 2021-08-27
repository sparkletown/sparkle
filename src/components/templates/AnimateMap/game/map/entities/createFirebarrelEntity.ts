import { Entity } from "@ash.ts/ash";
import { Sprite } from "pixi.js";

import { ReplicatedFirebarrel } from "../../../../../../store/reducers/AnimateMap";
import { GameConfig } from "../../../configs/GameConfig";
import { ImageToCanvas } from "../../commands/ImageToCanvas";
import { LoadImage } from "../../commands/LoadImage";
import { RoundAvatar } from "../../commands/RoundAvatar";
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

const getCollisionRadius = (): number => {
  return GameConfig.VENUE_DEFAULT_COLLISION_RADIUS / 2;
};

const createTooltip = (entity: Entity) => {
  const tooltip = new TooltipComponent(
    `Join to firebarrel`,
    getCollisionRadius(),
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

const drawAvatars = (
  barrel: ReplicatedFirebarrel,
  spriteComponent: SpriteComponent
) => {
  const sprite = spriteComponent.view as Barrel;
  const avatars: Array<Promise<RoundAvatar>> = [];

  barrel.data.connectedUsers.forEach((user) => {
    let avatarUrlString = user.data.avatarUrlString;
    if (!Array.isArray(avatarUrlString)) {
      avatarUrlString = [avatarUrlString];
    }
    const url = avatarUrlString.length > 0 ? avatarUrlString[0] : "";

    avatars.push(new RoundAvatar(url).execute());
  });

  Promise.all(avatars).then((avatars) => {
    if (sprite.avatars) {
      sprite.avatars.removeChildren();
    }

    if (avatars.length > 0 && !sprite.avatars) {
      sprite.avatars = new Sprite();
      sprite.avatars.anchor.set(0.5);
      sprite.addChild(sprite.avatars);
    }

    if (avatars.length > 0 && sprite.avatars) {
      const angle = (2 * Math.PI) / avatars.length;
      const radius = getCollisionRadius() * 4;
      for (let i = 0; i < avatars.length; i++) {
        if (!avatars[i].canvas) {
          continue;
        }
        const s = Sprite.from(avatars[i].canvas as HTMLCanvasElement);
        s.anchor.set(0.5);
        s.scale.set(0.85);
        s.x = Math.cos(angle * i) * radius;
        s.y = Math.sin(angle * i) * radius;
        sprite.avatars.addChild(s);
      }
    }
  });
};

const drawBarrel = (
  barrel: ReplicatedFirebarrel,
  spriteComponent: SpriteComponent,
  positionComponent: PositionComponent
) => {
  new LoadImage(barrel.data.iconSrc)
    .execute()
    .then(
      (comm: LoadImage): Promise<ImageToCanvas> => {
        if (!comm.image) return Promise.reject();

        // the picture can be very large
        const scale = ((getCollisionRadius() * 2) / comm.image.width) * 2;
        return new ImageToCanvas(comm.image).scaleTo(scale).execute();
      }
    )
    .then((comm: ImageToCanvas) => {
      const scale = (getCollisionRadius() * 2) / comm.canvas.width / 2;
      positionComponent.scaleX = scale;
      positionComponent.scaleY = scale;

      const sprite = spriteComponent.view as Barrel;
      sprite.barrel = Sprite.from(comm.canvas);
      sprite.barrel.anchor.set(0.5);
      sprite.addChild(sprite.barrel);

      sprite.halo = Sprite.from(HALO);
      sprite.halo.anchor.set(0.5);
      sprite.addChildAt(sprite.halo, 0);
    })
    .catch((err) => {
      // TODO default venue image
      console.log("err", err);
    });
};

export const createFirebarrelEntity = (
  barrel: ReplicatedFirebarrel,
  creator: EntityFactory
): Entity => {
  const positionComponent = new PositionComponent(barrel.x, barrel.y);
  const spriteComponent: SpriteComponent = new SpriteComponent();
  const barrelVew = new Barrel();
  spriteComponent.view = barrelVew;
  spriteComponent.view.zIndex = -1;

  const entity: Entity = new Entity();
  entity
    .add(new BarrelComponent(barrel))
    .add(new CollisionComponent(getCollisionRadius()))
    .add(positionComponent)
    .add(spriteComponent)
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

  drawBarrel(barrel, spriteComponent, positionComponent);
  drawAvatars(barrel, spriteComponent);

  return entity;
};
