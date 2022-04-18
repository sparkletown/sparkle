import { Entity } from "@ash.ts/ash";
import { Sprite } from "pixi.js";

import { DEFAULT_PORTAL_BOX } from "settings";

import { setAnimateMapRoom } from "store/actions/AnimateMap";
import { ReplicatedVenue } from "store/reducers/AnimateMap";

import { CropVenue } from "../../commands/CropVenue";
import { GameConfig } from "../../common";
import { AnimationComponent } from "../components/AnimationComponent";
import { ClickableSpriteComponent } from "../components/ClickableSpriteComponent";
import { CollisionComponent } from "../components/CollisionComponent";
import { HoverableSpriteComponent } from "../components/HoverableSpriteComponent";
import { PositionComponent } from "../components/PositionComponent";
import { SpriteComponent } from "../components/SpriteComponent";
import { TooltipComponent } from "../components/TooltipComponent";
import { VenueComponent } from "../components/VenueComponent";
import { FSMBase } from "../finalStateMachines/FSMBase";
import { HoverIn } from "../graphics/HoverIn";
import { HoverOut } from "../graphics/HoverOut";
import { Venue } from "../graphics/Venue";
import { VenueHalo } from "../graphics/VenueHalo";
import { VenueHaloAnimated } from "../graphics/VenueHaloAnimated";
import { VenueHaloEmpty } from "../graphics/VenueHaloEmpty";

import EntityFactory from "./EntityFactory";

const TOOLTIP_COLOR_DEFAULT = 0x655a4d;
const TOOLTIP_COLOR_ISLIVE = 0x8e5ffe;
const TOOLTIP_TEXT_LENGTH_MAX = 18;

const addVenueTooltip = (venue: ReplicatedVenue, entity: Entity) => {
  if (entity.get(TooltipComponent)) {
    return;
  }
  const text =
    venue.data.title.length > TOOLTIP_TEXT_LENGTH_MAX
      ? venue.data.title.slice(0, 15) + "..."
      : venue.data.title;
  const tooltip = new TooltipComponent(text);
  tooltip.borderColor = venue.data.isLive
    ? TOOLTIP_COLOR_ISLIVE
    : TOOLTIP_COLOR_DEFAULT;
  tooltip.backgroundColor = tooltip.borderColor;
  entity.add(tooltip);
};

const updateVenueImage = (
  replicatedVenue: ReplicatedVenue,
  spriteComponent: SpriteComponent,
  positionComponent: PositionComponent,
  config: GameConfig
): Promise<void> => {
  return new CropVenue(replicatedVenue.data.image_url, config)
    .setUsersCount(replicatedVenue.data.countUsers)
    .setWithoutPlate(replicatedVenue.data.withoutPlate)
    .setUsersCountColor(
      replicatedVenue.data.isLive ? TOOLTIP_COLOR_ISLIVE : TOOLTIP_COLOR_DEFAULT
    )
    .execute()
    .then((comm: CropVenue) => {
      const scaleSize = replicatedVenue.data.withoutPlate ? 4 : 1;
      const size = config.VENUE_DEFAULT_SIZE * scaleSize;
      const scale = size / comm.canvas.width;
      positionComponent.scaleY = scale;
      positionComponent.scaleX = scale;

      const venueSprite = spriteComponent.view as Venue;
      if (venueSprite.main) {
        venueSprite.main.parent?.removeChild(venueSprite.main);
      }

      venueSprite.main = Sprite.from(comm.canvas);
      if (replicatedVenue.data.withoutPlate) {
        // 1 - 0.5 / ((comm.canvas.height * 2) / comm.canvas.width)
        venueSprite.main.anchor.set(0.5, 0.5);
      } else {
        venueSprite.main.anchor.set(0.5);
      }
      venueSprite.addChild(venueSprite.main);
      return Promise.resolve();
    })
    .catch((err) => {
      console.log("err", err);
    })
    .finally(() => {
      return Promise.resolve();
    });
};

const getCurrentReplicatedVenue = (
  venueComponent: VenueComponent
): ReplicatedVenue => {
  return venueComponent.model;
};

export const updateVenueEntity = (
  venue: ReplicatedVenue,
  creator: EntityFactory
) => {
  const node = creator.getVenueNode(venue);
  if (!node) {
    return;
  }

  node.venue.model = venue;
  node.entity.add(node.venue);

  const sprite = node.entity.get(SpriteComponent);
  if (!sprite) {
    return;
  }
  updateVenueImage(venue, sprite, node.position, creator.controls.getConfig());
};

export const createVenueEntity = (
  venue: ReplicatedVenue,
  creator: EntityFactory
) => {
  const config = creator.controls.getConfig();
  const engine = creator.engine;
  const entity: Entity = new Entity();
  const fsm: FSMBase = new FSMBase(entity);
  const venueComponent = new VenueComponent(venue, fsm);
  const positionComponent = new PositionComponent(venue.x, venue.y, 0, 0, 0);
  const spriteComponent: SpriteComponent = new SpriteComponent();
  const sprite: Venue = new Venue();
  sprite.zIndex = -1;
  spriteComponent.view = sprite;

  fsm
    .createState(venueComponent.WITHOUT_HALO)
    .add(VenueHaloEmpty)
    .withMethod(
      (): VenueHaloEmpty => {
        return new VenueHaloEmpty(sprite);
      }
    );

  fsm
    .createState(venueComponent.HALO)
    .add(VenueHalo)
    .withMethod(
      (): VenueHalo => {
        return new VenueHalo(sprite);
      }
    );

  fsm
    .createState(venueComponent.HALO_ANIMATED)
    .add(AnimationComponent)
    .withMethod(
      (): AnimationComponent => {
        return new AnimationComponent(
          new VenueHaloAnimated(sprite),
          Number.MAX_VALUE
        );
      }
    );

  let hoverEffectEntity: Entity;
  const hoverEffectDuration = 100;
  const scaleSize = venue.data.withoutPlate ? 3.5 : 1;
  entity
    .add(positionComponent)
    .add(venueComponent)
    .add(spriteComponent)
    .add(
      new CollisionComponent(config.VENUE_DEFAULT_COLLISION_RADIUS * scaleSize)
    )
    .add(
      new HoverableSpriteComponent(
        () => {
          // add tooltip
          const waiting = creator.getWaitingVenueClick();
          const currentVenue = getCurrentReplicatedVenue(venueComponent);
          if (!waiting || waiting.data.id !== currentVenue.data.id) {
            addVenueTooltip(currentVenue, entity);
          }

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
          entity.remove(TooltipComponent);
          // add decrease
          const comm: SpriteComponent | null = entity.get(SpriteComponent);
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
        const currentVenue = getCurrentReplicatedVenue(venueComponent);
        creator.controls.dispatch(
          setAnimateMapRoom({
            ...DEFAULT_PORTAL_BOX,
            title: currentVenue.data.title,
            subtitle: currentVenue.data.subtitle,
            url: currentVenue.data.url,
            about: currentVenue.data.about,
            isEnabled: currentVenue.data.isEnabled,
            image_url: currentVenue.data.image_url,
          })
        );
      })
    );

  engine.addEntity(entity);

  spriteComponent.view.visible = false;
  updateVenueImage(
    venue,
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
