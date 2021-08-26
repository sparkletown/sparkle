import { Entity } from "@ash.ts/ash";
import { Sprite } from "pixi.js";

import { setAnimateMapRoom } from "../../../../../../store/actions/AnimateMap";
import { ReplicatedVenue } from "../../../../../../store/reducers/AnimateMap";
import { GameConfig } from "../../../configs/GameConfig";
import { CropVenue } from "../../commands/CropVenue";
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
import { Venue } from "../graphics/Venue";
import { VenueHalo } from "../graphics/VenueHalo";
import { VenueHaloAnimated } from "../graphics/VenueHaloAnimated";
import { VenueHaloEmpty } from "../graphics/VenueHaloEmpty";
import { VenueHoverIn } from "../graphics/VenueHoverIn";
import { VenueHoverOut } from "../graphics/VenueHoverOut";

import EntityFactory from "./EntityFactory";

const addVenueTooltip = (
  venue: ReplicatedVenue,
  entity: Entity,
  text: string
) => {
  if (entity.get(TooltipComponent)) {
    return;
  }

  const tooltip = new TooltipComponent(text);
  tooltip.borderColor = venue.data.isEnabled ? 0x7c46fb : 0x655a4d;
  tooltip.backgroundColor = tooltip.borderColor;
  entity.add(tooltip);
};

const updateVenueImage = (
  replicatedVenue: ReplicatedVenue,
  spriteComponent: SpriteComponent,
  positionComponent: PositionComponent
) => {
  new CropVenue(replicatedVenue.data.image_url, replicatedVenue.data.isEnabled)
    .setUsersCount(replicatedVenue.data.countUsers)
    .execute()
    .then((comm: CropVenue) => {
      const size = GameConfig.VENUE_DEFAULT_SIZE;
      const scale = size / comm.canvas.width;
      positionComponent.scaleY = scale;
      positionComponent.scaleX = scale;

      const venueSprite = spriteComponent.view as Venue;
      if (venueSprite.venue) {
        venueSprite.venue.parent?.removeChild(venueSprite.venue);
      }

      venueSprite.venue = Sprite.from(comm.canvas);
      venueSprite.venue.anchor.set(0.5);
      venueSprite.addChild(venueSprite.venue);
      return Promise.resolve();
    })
    .catch((err) => {
      console.log("err", err);
    });
};

export const updateVenueEntity = (
  venue: ReplicatedVenue,
  creator: EntityFactory
) => {
  const node = creator.getVenueNode(venue);
  if (!node) {
    return;
  }
  const sprite = node.entity.get(SpriteComponent);
  if (!sprite) {
    return;
  }
  updateVenueImage(node.venue.model, sprite, node.position);
};

export const createVenueEntity = (
  venue: ReplicatedVenue,
  creator: EntityFactory
) => {
  const engine = creator.engine;
  const entity: Entity = new Entity();
  const fsm: FSMBase = new FSMBase(entity);
  const venueComponent = new VenueComponent(venue, fsm);
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
        return new VenueHalo(sprite, entity.get(PositionComponent)?.scaleY);
      }
    );

  fsm
    .createState(venueComponent.HALO_ANIMATED)
    .add(AnimationComponent)
    .withMethod(
      (): AnimationComponent => {
        return new AnimationComponent(
          new VenueHaloAnimated(sprite, entity.get(PositionComponent)?.scaleY),
          Number.MAX_VALUE
        );
      }
    );

  let hoverEffectEntity: Entity;
  const hoverEffectDuration = 100;

  entity
    .add(venueComponent)
    .add(spriteComponent)
    .add(
      new HoverableSpriteComponent(
        () => {
          // add tooltip
          const waiting = creator.getWaitingVenueClick();
          if (!waiting || waiting.data.id !== venue.data.id) {
            addVenueTooltip(
              venue,
              entity,
              venue.data.title.length > 18
                ? venue.data.title.slice(0, 15) + "..."
                : venue.data.title
            );
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
                new VenueHoverIn(comm.view as Venue, hoverEffectDuration),
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
                new VenueHoverOut(comm.view as Venue, hoverEffectDuration),
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
        GameInstance.instance.getStore().dispatch(
          setAnimateMapRoom({
            title: venue.data.title,
            subtitle: venue.data.subtitle,
            url: venue.data.url,
            about: venue.data.about,
            x_percent: 50,
            y_percent: 50,
            width_percent: 5,
            height_percent: 5,
            isEnabled: venue.data.isEnabled,
            image_url: venue.data.image_url,
          })
        );
      })
    )
    .add(new CollisionComponent(GameConfig.VENUE_DEFAULT_COLLISION_RADIUS));

  const position = new PositionComponent(venue.x, venue.y, 0, 0, 0);
  entity.add(position);
  engine.addEntity(entity);

  updateVenueImage(venue, spriteComponent, position);

  return entity;
};
