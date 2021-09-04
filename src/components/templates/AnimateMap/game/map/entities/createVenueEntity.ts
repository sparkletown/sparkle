import { Entity } from "@ash.ts/ash";
import { Sprite } from "pixi.js";

import { setAnimateMapRoom } from "store/actions/AnimateMap";
import { ReplicatedVenue } from "store/reducers/AnimateMap";

import { GameConfig } from "../../../configs/GameConfig";
import { CropVenue } from "../../commands/CropVenue";
import { MAN_BURN, TEMPLE_BURN } from "../../constants/AssetConstants";
import { GameInstance } from "../../GameInstance";
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
import { VenueBurn } from "../graphics/VenueBurn";
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

const updateVenueBurnedImage = (
  replicatedVenue: ReplicatedVenue,
  spriteComponent: SpriteComponent,
  positionComponent: PositionComponent
) => {
  // 'The Man' | 'Temple'
  //   (spriteComponent.view as VenueBurn).setState(WithoutPlateVenueState.idle);
  return Promise.all([
    new CropVenue(replicatedVenue.data.image_url)
      .setUsersCount(replicatedVenue.data.countUsers)
      .setWithoutPlate(replicatedVenue.data.withoutPlate)
      .setUsersCountColor(
        replicatedVenue.data.isLive
          ? TOOLTIP_COLOR_ISLIVE
          : TOOLTIP_COLOR_DEFAULT
      )
      .execute(),
    new CropVenue(
      replicatedVenue.data.title === "Temple" ? TEMPLE_BURN : MAN_BURN
    )
      .setUsersCount(replicatedVenue.data.countUsers)
      .setWithoutPlate(replicatedVenue.data.withoutPlate)
      .setUsersCountColor(
        replicatedVenue.data.isLive
          ? TOOLTIP_COLOR_ISLIVE
          : TOOLTIP_COLOR_DEFAULT
      )
      .execute(),
  ])
    .then(([comm, comm1]) => {
      const scaleSize = 4;
      const size = GameConfig.VENUE_DEFAULT_SIZE * scaleSize;

      const scale = size / comm.canvas.width;
      positionComponent.scaleY = scale;
      positionComponent.scaleX = scale;

      const venueSprite = spriteComponent.view as VenueBurn;

      if (venueSprite.main) {
        if (venueSprite.main.children.length > 0) {
          venueSprite.main.removeChildren(0);
        }
        const main = Sprite.from(comm.canvas);
        main.anchor.set(0.5, 0.5);
        venueSprite.main.addChild(main);
      }

      if (venueSprite.burned) {
        if (venueSprite.burned.children.length > 0) {
          venueSprite.burned.removeChildren(0);
        }
        const burned = Sprite.from(comm1.canvas);
        burned.anchor.set(0.5, 0.5);
        venueSprite.burned.addChild(burned);
      }

      return Promise.resolve();
    })
    .catch((err) => {
      console.log("err", err);
    })
    .finally(() => {
      return Promise.resolve();
    });
};

const updateVenueImage = (
  replicatedVenue: ReplicatedVenue,
  spriteComponent: SpriteComponent,
  positionComponent: PositionComponent
): Promise<void> => {
  return new CropVenue(replicatedVenue.data.image_url)
    .setUsersCount(replicatedVenue.data.countUsers)
    .setUsersCountColor(
      replicatedVenue.data.isLive ? TOOLTIP_COLOR_ISLIVE : TOOLTIP_COLOR_DEFAULT
    )
    .execute()
    .then((comm: CropVenue) => {
      const scaleSize = 1;
      const size = GameConfig.VENUE_DEFAULT_SIZE * scaleSize;
      const scale = size / comm.canvas.width;
      positionComponent.scaleY = scale;
      positionComponent.scaleX = scale;

      const venueSprite = spriteComponent.view as Venue;
      if (venueSprite.main) {
        venueSprite.main.parent?.removeChild(venueSprite.main);
      }

      venueSprite.main = Sprite.from(comm.canvas);
      venueSprite.main.anchor.set(0.5);
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

  const spriteComponent = node.entity.get(SpriteComponent);
  if (!spriteComponent) {
    return;
  }

  if (node.venue.model.data.withoutPlate) {
    return updateVenueBurnedImage(
      node.venue.model,
      spriteComponent,
      node.position
    );
  } else {
    return updateVenueImage(venue, spriteComponent, node.position);
  }
};

export const createVenueEntity = (
  venue: ReplicatedVenue,
  creator: EntityFactory
) => {
  const engine = creator.engine;
  const entity: Entity = new Entity();
  const fsm: FSMBase = new FSMBase(entity);
  const venueComponent = new VenueComponent(venue, fsm);
  const positionComponent = new PositionComponent(venue.x, venue.y, 0, 0, 0);
  const spriteComponent: SpriteComponent = new SpriteComponent();
  const sprite: Venue | VenueBurn = venue.data.withoutPlate
    ? new VenueBurn()
    : new Venue();
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
      new CollisionComponent(
        GameConfig.VENUE_DEFAULT_COLLISION_RADIUS * scaleSize
      )
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
        GameInstance.instance.getStore().dispatch(
          setAnimateMapRoom({
            title: currentVenue.data.title,
            subtitle: currentVenue.data.subtitle,
            url: currentVenue.data.url,
            about: currentVenue.data.about,
            x_percent: 50,
            y_percent: 50,
            width_percent: 5,
            height_percent: 5,
            isEnabled: currentVenue.data.isEnabled,
            image_url: currentVenue.data.image_url,
          })
        );
      })
    );

  engine.addEntity(entity);

  spriteComponent.view.visible = false;

  if (venue.data.withoutPlate) {
    updateVenueBurnedImage(venue, spriteComponent, positionComponent).finally(
      () => {
        if (spriteComponent && spriteComponent.view) {
          spriteComponent.view.visible = true;
        }
      }
    );
  } else {
    updateVenueImage(venue, spriteComponent, positionComponent).finally(() => {
      if (spriteComponent && spriteComponent.view) {
        spriteComponent.view.visible = true;
      }
    });
  }

  return entity;
};
