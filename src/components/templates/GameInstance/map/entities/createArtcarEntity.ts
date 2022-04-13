import { Entity } from "@ash.ts/ash";
import { Sprite } from "pixi.js";

import { DEFAULT_PORTAL_BOX } from "settings";

import { GameConfig } from "../../../GameConfig/GameConfig";
import { ReplicatedArtcar } from "../../../GameInstanceCommonInterfaces";
import { Point } from "../../../types";
import { GameInstance } from "../../GameInstance";
import { ArtcarComponent } from "../components/ArtcarComponent";
import { ClickableSpriteComponent } from "../components/ClickableSpriteComponent";
import { CollisionComponent } from "../components/CollisionComponent";
import { EllipseComponent } from "../components/EllipseComponent";
import { HoverableSpriteComponent } from "../components/HoverableSpriteComponent";
import { PositionComponent } from "../components/PositionComponent";
import { SpriteComponent } from "../components/SpriteComponent";
import { TooltipComponent } from "../components/TooltipComponent";
import { FSMBase } from "../finalStateMachines/FSMBase";

import EntityFactory from "./EntityFactory";

// const TOOLTIP_COLOR_DEFAULT = 0x655a4d;
const TOOLTIP_COLOR_ISLIVE = 0x8e5ffe;

const addArtcarTooltip = (artcar: ReplicatedArtcar, entity: Entity) => {
  if (entity.get(TooltipComponent)) {
    return;
  }
  const tooltip = new TooltipComponent(artcar.data.title);
  tooltip.borderColor = TOOLTIP_COLOR_ISLIVE;
  tooltip.backgroundColor = tooltip.borderColor;
  entity.add(tooltip);
};

const getCurrentArtcar = (
  artcarComponent: ArtcarComponent
): ReplicatedArtcar => {
  return artcarComponent.artcar;
};

/*

https://burn.sparklever.se/in/trihonk
https://burn.sparklever.se/in/caranivana
https://burn.sparklever.se/in/boatymcboatface
https://burn.sparklever.se/in/interiorcrocodilealligator
https://burn.sparklever.se/in/wheelyfishsticks
 */

export const createArtcarEntity = (
  user: ReplicatedArtcar,
  creator: EntityFactory
): Entity => {
  const scale = 0.3;

  const config = GameInstance.instance.getConfig();
  // const innerRadius = config.venuesMainCircleOuterRadius;
  // const outerRadius = config.borderRadius;
  const worldCenter: Point = config.worldCenter;
  //
  // const angle = creator.getRandomNumber(0, 360) * (Math.PI / 180);
  // const radiusX = creator.getRandomNumber(innerRadius, outerRadius);
  // const radiusY = creator.getRandomNumber(innerRadius, outerRadius);
  //
  // user.x = worldCenter.x + Math.cos(angle) * radiusX;
  // user.y = worldCenter.y + Math.sin(angle) * radiusY;

  const entity: Entity = new Entity();
  const fsm: FSMBase = new FSMBase(entity);
  const artcarComponent = new ArtcarComponent(user, fsm);
  fsm
    .createState("moving")
    .add(EllipseComponent)
    .withInstance(
      new EllipseComponent(
        worldCenter.x,
        worldCenter.y,
        user.radiusX,
        user.radiusY,
        user.angle
      )
    );

  entity
    .add(artcarComponent)
    .add(new PositionComponent(user.x, user.y, 0, scale, scale))
    .add(new CollisionComponent(GameConfig.VENUE_DEFAULT_COLLISION_RADIUS))
    .add(
      new HoverableSpriteComponent(
        () => {
          // add tooltip
          const waiting = creator.getWaitingVenueClick();
          const currentArtcar = getCurrentArtcar(artcarComponent);
          if (!waiting || waiting.data.id !== currentArtcar.data.id) {
            addArtcarTooltip(currentArtcar, entity);
          }
        },
        () => {
          // remove tooltip
          entity.remove(TooltipComponent);
        }
      )
    )
    .add(
      new ClickableSpriteComponent(() => {
        const currentVenueArtcar = getCurrentArtcar(artcarComponent);
        GameInstance.instance.gameInstanceProvider.handleSetAnimateMapRoom({
          ...DEFAULT_PORTAL_BOX,
          title: currentVenueArtcar.data.title,
          subtitle: "",
          url: currentVenueArtcar.data.url,
          about: currentVenueArtcar.data.about,
          isEnabled: currentVenueArtcar.data.isEnabled,
          image_url: currentVenueArtcar.data.image_url,
        });
      })
    );

  fsm.changeState("moving");
  creator.engine.addEntity(entity);

  const img: HTMLImageElement = new Image();
  const canvas: HTMLCanvasElement = document.createElement("canvas");
  const context: CanvasRenderingContext2D = canvas.getContext(
    "2d"
  ) as CanvasRenderingContext2D;
  new Promise((resolve) => {
    img.addEventListener("load", () => {
      canvas.width = img.height;
      canvas.height = img.width;
      const x = canvas.width / 2;
      const y = canvas.height / 2;
      const width = img.width;
      const height = img.height;
      context.translate(x, y);
      context.rotate(1.5708);
      context.drawImage(img, -width / 2, -height / 2, width, height);
      context.rotate(-1.5708);
      context.translate(-x, -y);

      resolve(true);
    });
    img.src = user.data.image_url || "";
  }).then(() => {
    const spriteComponent: SpriteComponent = new SpriteComponent();
    spriteComponent.view = new Sprite();
    spriteComponent.view.anchor.set(0.5);
    const view = Sprite.from(canvas);
    view.anchor.set(0.5);
    // const halo = Sprite.from(artcarsHalo[user.colorIndex]);
    // halo.scale.set(2);
    // halo.anchor.set(0.5);

    // spriteComponent.view.addChild(halo);
    spriteComponent.view.addChild(view);

    entity.add(spriteComponent);
  });

  return entity;
};
