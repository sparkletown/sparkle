import { Entity } from "@ash.ts/ash";
import { Sprite } from "pixi.js";

import { ReplicatedUser } from "../../../../../../store/reducers/AnimateMap";
import { Point } from "../../../../../../types/utility";
import { GameConfig } from "../../../configs/GameConfig";
import { FIREBARELL_HALO } from "../../constants/AssetConstants";
import { GameInstance } from "../../GameInstance";
import { ArtcarComponent } from "../components/ArtcarComponent";
import { CollisionComponent } from "../components/CollisionComponent";
import { EllipseComponent } from "../components/EllipseComponent";
import { HoverableSpriteComponent } from "../components/HoverableSpriteComponent";
import { PositionComponent } from "../components/PositionComponent";
import { SpriteComponent } from "../components/SpriteComponent";
import { TooltipComponent } from "../components/TooltipComponent";
import { FSMBase } from "../finalStateMachines/FSMBase";

import EntityFactory from "./EntityFactory";

const TOOLTIP_COLOR_DEFAULT = 0x655a4d;
// const TOOLTIP_COLOR_ISLIVE = 0x8e5ffe;
const TOOLTIP_TEXT_LENGTH_MAX = 18;

const addArtcarTooltip = (artcar: ReplicatedUser, entity: Entity) => {
  if (entity.get(TooltipComponent)) {
    return;
  }
  let text = artcar.data.partyName ? artcar.data.partyName : "Nemo";
  text =
    text.length > TOOLTIP_TEXT_LENGTH_MAX ? text.slice(0, 15) + "..." : text;
  const tooltip = new TooltipComponent(text);

  tooltip.borderColor = TOOLTIP_COLOR_DEFAULT;
  // tooltip.borderColor = artcar.data.isLive
  //     ? TOOLTIP_COLOR_ISLIVE
  //     : TOOLTIP_COLOR_DEFAULT;
  tooltip.backgroundColor = tooltip.borderColor;
  entity.add(tooltip);
};

const getCurrentReplicatedVenue = (
  artcarComponent: ArtcarComponent
): ReplicatedUser => {
  return artcarComponent.artcar;
};

export const createArtcars = (creator: EntityFactory) => {
  const arr = [
    {
      name: "Darth Paul Art Car",
      link: "https://burn.sparklever.se/in/darthpaul",
    },
    {
      name: "Hand Some Art Car",
      link: "https://burn.sparklever.se/in/handsome",
    },
    {
      name: "Lobo de Playa Art Car",
      link: "https://burn.sparklever.se/in/lobodeplaya",
    },
    {
      name: "Send Noods Art Car",
      link: "thttps://burn.sparklever.se/in/sendnoods",
    },
    {
      name: "Arachnia Art Car",
      link: "https://burn.sparklever.se/in/arachnia",
    },
    {
      name: "Silly Lily Art Car",
      link: "https://burn.sparklever.se/in/sillylily",
    },
    {
      name: "Glam Clam Art Car",
      link: "https://burn.sparklever.se/in/glamclam",
    },
    {
      name: "Dragon: The Car Art Car",
      link: "https://burn.sparklever.se/in/dragonthecar",
    },
    { name: "Tri-Honk Art Car", link: "https://burn.sparklever.se/in/trihonk" },
    {
      name: "Caranirvana Art Car",
      link: "https://burn.sparklever.se/in/caranivana",
    },
    {
      name: "Boaty McBoatface Art Car",
      link: "https://burn.sparklever.se/in/interiorcrocodilealligator",
    },
    {
      name: "Interior Crocodile Alligator Art Car",
      link: "https://burn.sparklever.se/in/lobodeplaya",
    },
    {
      name: "Wheely Fish Sticks Art Car",
      link: "https://burn.sparklever.se/in/wheelyfishsticks",
    },
  ];

  arr.forEach((item) => {
    const user: ReplicatedUser = {
      x: 0,
      y: 0,
      data: {
        id: item.link,
        partyName: item.name,
        messengerId: 0,
        pictureUrl: "",
        dotColor: 0,
        hat: "",
        accessories: "",
        cycle: "",
      },
    };
    creator.createArtcar(user);
  });
};
/*

https://burn.sparklever.se/in/trihonk
https://burn.sparklever.se/in/caranivana
https://burn.sparklever.se/in/boatymcboatface
https://burn.sparklever.se/in/interiorcrocodilealligator
https://burn.sparklever.se/in/wheelyfishsticks
 */

export const createArtcarEntity = (
  user: ReplicatedUser,
  creator: EntityFactory
): Entity => {
  const scale = 0.3;

  const config = GameInstance.instance.getConfig();
  const innerRadius = config.venuesMainCircleOuterRadius;
  const outerRadius = config.borderRadius;
  const worldCenter: Point = config.worldCenter;

  const angle = creator.getRandomNumber(0, 360) * (Math.PI / 180);
  const radiusX = creator.getRandomNumber(innerRadius, outerRadius);
  const radiusY = creator.getRandomNumber(innerRadius, outerRadius);

  user.x = worldCenter.x + Math.cos(angle) * radiusX;
  user.y = worldCenter.y + Math.sin(angle) * radiusY;

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
        radiusX,
        radiusY,
        angle
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
          const currentArtcar = getCurrentReplicatedVenue(artcarComponent);
          if (!waiting || `${waiting.data.id}` !== currentArtcar.data.id) {
            addArtcarTooltip(currentArtcar, entity);
          }
        },
        () => {
          // remove tooltip
          entity.remove(TooltipComponent);
        }
      )
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
    img.src = user.data.pictureUrl || "";
  }).then(() => {
    const spriteComponent: SpriteComponent = new SpriteComponent();
    spriteComponent.view = new Sprite();
    spriteComponent.view.anchor.set(0.5);
    const view = Sprite.from(canvas);
    view.anchor.set(0.5);
    const halo = Sprite.from(FIREBARELL_HALO);
    halo.anchor.set(0.5);

    spriteComponent.view.addChild(view);
    spriteComponent.view.addChild(halo);

    entity.add(spriteComponent);
  });

  return entity;
};
