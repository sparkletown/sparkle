import { Engine, Entity } from "@ash.ts/ash";
import { Sprite } from "pixi.js";

import { setAnimateMapRoom } from "../../../../../../store/actions/AnimateMap";
import { ReplicatedVenue } from "../../../../../../store/reducers/AnimateMap";
import { CropVenue } from "../../commands/CropVenue";
import { VENUE_HALO } from "../../constants/AssetConstants";
import { GameInstance } from "../../GameInstance";
import { AnimationComponent } from "../components/AnimationComponent";
import { ClickableSpriteComponent } from "../components/ClickableSpriteComponent";
import { CollisionComponent } from "../components/CollisionComponent";
import { HoverableSpriteComponent } from "../components/HoverableSpriteComponent";
import { PositionComponent } from "../components/PositionComponent";
import { SpriteComponent } from "../components/SpriteComponent";
import { TooltipComponent } from "../components/TooltipComponent";
import { VenueComponent } from "../components/VenueComponent";
import { Venue } from "../graphics/Venue";
import { VenueHoverIn } from "../graphics/VenueHoverIn";
import { VenueHoverOut } from "../graphics/VenueHoverOut";

export const createVenueEntity = (venue: ReplicatedVenue, engine: Engine) => {
  const config = GameInstance.instance.getConfig();

  const entity: Entity = new Entity();
  entity
    .add(new VenueComponent(venue))
    .add(
      new HoverableSpriteComponent(
        () => {
          // add tooltip
          const tooltip: TooltipComponent = new TooltipComponent(
            venue.data.title.slice(0, 15) + "..."
          );
          tooltip.borderColor = venue.data.isEnabled ? 0x7c46fb : 0x655a4d;
          tooltip.backgroundColor = tooltip.borderColor;
          entity.add(tooltip);
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
    .add(new CollisionComponent(config.venueDefaultCollisionRadius));

  engine.addEntity(entity);

  new CropVenue(venue.data.image_url)
    .execute()
    .then((comm: CropVenue) => {
      const scale =
        (config.venueDefaultCollisionRadius * 2) / comm.canvas.width;
      entity.add(new PositionComponent(venue.x, venue.y, 0, scale, scale));

      const sprite: Venue = new Venue();
      sprite.venue = Sprite.from(comm.canvas);
      sprite.venue.anchor.set(0.5);
      sprite.addChild(sprite.venue);
      const spriteComponent: SpriteComponent = new SpriteComponent();
      spriteComponent.view = sprite;

      if (venue.data.isEnabled) {
        // halo
        sprite.halo = Sprite.from(VENUE_HALO);
        sprite.halo.anchor.set(0.5);
        sprite.addChildAt(sprite.halo, 0);
        sprite.halo.scale.set(1 / scale);
      }

      entity.add(spriteComponent);
    })
    .catch((err) => {
      // TODO default venue image
      console.log("err", err);
    });

  return entity;
};
