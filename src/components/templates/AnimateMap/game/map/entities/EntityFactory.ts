import { Engine, Entity, NodeList } from "@ash.ts/ash";
import { Sprite } from "pixi.js";

import {
  PlayerModel,
  ReplicatedFirebarrel,
  ReplicatedUser,
  ReplicatedVenue,
} from "store/reducers/AnimateMap";

import { Point } from "types/utility";

import { setAnimateMapFireBarrel } from "../../../../../../store/actions/AnimateMap";
import { RoundAvatar } from "../../commands/RoundAvatar";
import { avatarCycles } from "../../constants/AssetConstants";
import { GameInstance } from "../../GameInstance";
import { ArtcarComponent } from "../components/ArtcarComponent";
import { AvatarTuningComponent } from "../components/AvatarTuningComponent";
import { BarrelComponent } from "../components/BarrelComponent";
import { BubbleComponent } from "../components/BubbleComponent";
import { CollisionComponent } from "../components/CollisionComponent";
import { DeadComponent } from "../components/DeadComponent";
import { EllipseComponent } from "../components/EllipseComponent";
import { HoverableSpriteComponent } from "../components/HoverableSpriteComponent";
import { JoystickComponent } from "../components/JoystickComponent";
import { KeyboardComponent } from "../components/KeyboardComponent";
import { MotionControlSwitchComponent } from "../components/MotionControlSwitchComponent";
import { MotionKeyboardControlComponent } from "../components/MotionKeyboardControlComponent";
import { MovementComponent } from "../components/MovementComponent";
import { PlayerComponent } from "../components/PlayerComponent";
import { PositionComponent } from "../components/PositionComponent";
import { SoundEmitterComponent } from "../components/SoundEmitterComponent";
import { SpriteComponent } from "../components/SpriteComponent";
import { TooltipComponent } from "../components/TooltipComponent";
import { ViewportComponent } from "../components/ViewportComponent";
import { ViewportFollowComponent } from "../components/ViewportFollowComponent";
import { WaitingVenueClickComponent } from "../components/WaitingVenueClickComponent";
import { FSMBase } from "../finalStateMachines/FSMBase";
import { Avatar } from "../graphics/Avatar";
import { VenueTooltipEnter } from "../graphics/VenueTooltipEnter";
import { AvatarTuningNode } from "../nodes/AvatarTuningNode";
import { BarrelNode } from "../nodes/BarrelNode";
import { BotNode } from "../nodes/BotNode";
import { JoystickNode } from "../nodes/JoystickNode";
import { KeyboardNode } from "../nodes/KeyboardNode";
import { MotionBotControlNode } from "../nodes/MotionBotControlNode";
import { PlayerNode } from "../nodes/PlayerNode";
import { VenueNode } from "../nodes/VenueNode";
import { ViewportNode } from "../nodes/ViewportNode";
import { WaitingVenueClickNode } from "../nodes/WaitingVenueClickNode";

import { createBotEntity } from "./createBotEntity";
import { createFirebarrelEntity } from "./createFirebarrelEntity";
import { createVenueEntity, updateVenueEntity } from "./createVenueEntity";

export default class EntityFactory {
  public engine: Engine;

  constructor(engine: Engine) {
    this.engine = engine;
  }

  public createWaitingVenueClick(venue: ReplicatedVenue): Entity | undefined {
    const nodes = this.engine.getNodeList(WaitingVenueClickNode);
    while (nodes.head) {
      this.engine.removeEntity(nodes.head.entity);
    }

    const venueNode = this.getVenueNode(venue);
    if (!venueNode) {
      return undefined;
    }

    const tooltip = new TooltipComponent("", 50);
    tooltip.view = new VenueTooltipEnter(
      venueNode.venue.model.data.title,
      0x6943f5
    );

    const spriteComponent = new SpriteComponent();
    spriteComponent.view = new Sprite();

    const entity = new Entity()
      .add(new WaitingVenueClickComponent(venue))
      .add(new DeadComponent(250))
      .add(spriteComponent)
      .add(new PositionComponent(venueNode.position.x, venueNode.position.y))
      .add(tooltip);

    this.engine.addEntity(entity);

    // removeAllTooltip on this venue
    venueNode.entity.remove(TooltipComponent);

    return entity;
  }

  public getWaitingVenueClick(): ReplicatedVenue | undefined {
    return this.engine.getNodeList(WaitingVenueClickNode).head?.venue.venue;
  }

  public getPlayerNode(): PlayerNode | null {
    return this.engine.getNodeList(PlayerNode).head;
  }

  public getRandomBot(): ReplicatedUser | undefined {
    const bots = GameInstance.instance.getState().users;
    const botIndex = Math.floor(Math.random() * bots.size);
    if (botIndex > 0) {
      const itr = bots.values();
      let count = 0;
      for (let bot = itr.next().value; bot; bot = itr.next().value) {
        if (count === botIndex) {
          return bot;
        }
        count++;
      }
    }
    return undefined;
  }

  public getBotNode(id: string): BotNode | null {
    const bots = this.engine.getNodeList(BotNode);
    for (let bot = bots?.head; bot; bot = bot.next) {
      if (bot.bot.data.data.id === id) {
        return bot;
      }
    }
    return null;
  }

  public createViewport(com: ViewportComponent): Entity {
    const nodelist = this.engine.getNodeList(ViewportNode);
    while (nodelist.head) {
      this.removeEntity(nodelist.head.entity);
    }
    const entity: Entity = new Entity().add(com);
    this.engine.addEntity(entity);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    return nodelist.head.entity;
  }

  public updateViewport(comm?: ViewportComponent) {
    const nodelist = this.engine.getNodeList(ViewportNode);
    if (!nodelist.head) {
      return;
    }
    nodelist.head.entity.add(comm ? comm : nodelist.head.viewport);
  }

  public createJoystick(comm: JoystickComponent): Entity {
    const nodelist = this.engine.getNodeList(JoystickNode);
    while (nodelist.head) {
      this.removeEntity(nodelist.head.entity);
    }

    const entity: Entity = new Entity().add(comm);
    this.engine.addEntity(entity);
    return entity;
  }

  public updateJoystick(comm?: JoystickComponent) {
    const nodelist = this.engine.getNodeList(JoystickNode);
    if (!nodelist.head) {
      return;
    }
    nodelist.head.entity.add(comm ? comm : nodelist.head.joystick);
  }

  public createKeyboard(
    comm: KeyboardComponent,
    control: MotionKeyboardControlComponent
  ): Entity {
    const nodelist = this.engine.getNodeList(KeyboardNode);
    while (nodelist.head) {
      this.removeEntity(nodelist.head.entity);
    }

    const entity = new Entity().add(comm).add(control);
    this.engine.addEntity(entity);
    return entity;
  }

  public updateKeyboard(comm: KeyboardComponent) {
    const nodelist = this.engine.getNodeList(KeyboardNode);
    if (!nodelist.head) {
      return;
    }
    nodelist.head.entity.add(comm ? comm : nodelist.head.keyboard);
  }

  public createBubble(userId: string, text: string): Entity | null {
    const bot = this.getBotNode(userId);
    if (bot) {
      bot.entity.add(new BubbleComponent(text, bot.bot.data.data.dotColor));
      return bot.entity;
    }
    return null;
  }

  public removeBubble(entity: Entity) {
    entity.remove(BubbleComponent);
  }

  public createPlayer(user: ReplicatedUser): Entity {
    let avatarUrlString = user.data.avatarUrlString;

    if (!Array.isArray(avatarUrlString)) {
      avatarUrlString = [avatarUrlString];
    }

    // HACK
    user.data.cycle = avatarCycles[0];

    const movementComponent = new MovementComponent();
    const motionControl = new MotionControlSwitchComponent();
    const collision: CollisionComponent = new CollisionComponent(0);

    const scale = 0.2;

    const entity: Entity = new Entity();
    const fsm: FSMBase = new FSMBase(entity);
    const player = new PlayerComponent(user, fsm);

    fsm.createState(player.IMMOBILIZED);

    fsm
      .createState(player.FLYING)
      .add(CollisionComponent)
      .withInstance(collision)
      .add(MovementComponent)
      .withInstance(movementComponent)
      .add(MotionControlSwitchComponent)
      .withInstance(motionControl);

    fsm
      .createState(player.CYCLING)
      .add(CollisionComponent)
      .withInstance(collision)
      .add(MovementComponent)
      .withInstance(movementComponent)
      .add(MotionControlSwitchComponent)
      .withInstance(motionControl);

    fsm
      .createState(player.WALKING)
      .add(CollisionComponent)
      .withInstance(collision)
      .add(MovementComponent)
      .withInstance(movementComponent)
      .add(MotionControlSwitchComponent)
      .withInstance(motionControl);

    entity
      .add(movementComponent)
      .add(motionControl)
      .add(player)
      .add(new PositionComponent(user.x, user.y, 0, scale, scale))
      .add(new ViewportFollowComponent());

    fsm.changeState("flying");
    this.engine.addEntity(entity);

    const url = avatarUrlString.length > 0 ? avatarUrlString[0] : "";
    const sprite: Avatar = new Avatar();
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

        const spriteComponent: SpriteComponent = new SpriteComponent();
        spriteComponent.view = sprite;
        entity.add(spriteComponent);
      });

    return entity;
  }

  public createArtcar(user: ReplicatedUser): Entity {
    let avatarUrlString = user.data.avatarUrlString;

    if (!Array.isArray(avatarUrlString)) {
      avatarUrlString = [avatarUrlString];
    }

    const scale = 0.3;

    const config = GameInstance.instance.getConfig();
    const innerRadius = config.venuesMainCircleOuterRadius;
    const outerRadius = config.borderRadius;
    const worldCenter: Point = config.worldCenter;

    const angle = this.getRandomNumber(0, 360) * (Math.PI / 180);
    const radiusX = this.getRandomNumber(innerRadius, outerRadius);
    const radiusY = this.getRandomNumber(innerRadius, outerRadius);

    user.x = worldCenter.x + Math.cos(angle) * radiusX;
    user.y = worldCenter.y + Math.sin(angle) * radiusY;

    const entity: Entity = new Entity();
    const fsm: FSMBase = new FSMBase(entity);
    fsm
      .createState("moving")
      .add(MovementComponent)
      .withInstance(new MovementComponent())
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
      .add(new ArtcarComponent(user, fsm))
      .add(new PositionComponent(user.x, user.y, 0, scale, scale))
      .add(new HoverableSpriteComponent());

    fsm.changeState("moving");
    this.engine.addEntity(entity);

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
      img.src = avatarUrlString[0];
    }).then(() => {
      const spriteComponent: SpriteComponent = new SpriteComponent();
      spriteComponent.view = Sprite.from(canvas);
      entity.add(spriteComponent);
    });

    return entity;
  }

  public updatePlayerTuning(node: PlayerNode) {
    node.entity.add(new AvatarTuningComponent(node.player.data));
  }

  public removePlayerTuning(node: PlayerNode) {
    node.entity.remove(AvatarTuningComponent);
  }

  public updateBotTuning(node: BotNode) {
    node.entity.add(new AvatarTuningComponent(node.bot.data));
  }

  public removeAvatarTuning(node: AvatarTuningNode) {
    node.entity.remove(AvatarTuningComponent);
  }

  public createBot(user: ReplicatedUser, realUser = false): Entity {
    return createBotEntity(user, this, realUser);
  }

  public removeBot(entity: Entity) {
    this.engine.removeEntity(entity);
  }

  public removeBotById(id: string) {
    const list: NodeList<BotNode> = this.engine.getNodeList(BotNode);
    for (let bot: BotNode | null | undefined = list.head; bot; bot = bot.next) {
      if (bot.bot.data.data.id === id) {
        this.removeBot(bot.entity);
        return;
      }
    }
  }

  public updateBotPosition(user: ReplicatedUser, x: number, y: number) {
    const list: NodeList<BotNode> = this.engine.getNodeList(BotNode);
    for (let bot = list.head; bot; bot = bot.next) {
      if (bot.bot.data.data.id === user.data.id) {
        bot.bot.fsm.changeState("idle");
        bot.bot.fsm.changeState("moving");
        const node: MotionBotControlNode = this.engine.getNodeList(
          MotionBotControlNode
        ).tail as MotionBotControlNode;
        node.click.x = x;
        node.click.y = y;
        return;
      }
    }
  }

  public updateUserPositionById(userId: string, x: number, y: number) {
    let bot: BotNode | null = this.getBotNode(userId);
    if (!bot) {
      const player: PlayerModel = new PlayerModel(userId, -1, "", x, y);
      // player.data.id = userId;
      // player.x = x;
      // player.y = y;
      this.createBot(player, true);
      bot = this.engine.getNodeList(BotNode).head as BotNode;
      bot.bot.fsm.changeState("idle");
    } else {
      this.updateBotPosition(bot.bot.data, x, y);
    }
  }

  public removeUserById(id: string) {
    const node: BotNode | null = this.getBotNode(id);
    if (node) {
      this.removeEntity(node.entity);
    }
  }

  public createUser(hero: ReplicatedUser): Entity {
    const entity: Entity = new Entity().add(
      new PositionComponent(hero.x, hero.y)
    );

    this.engine.addEntity(entity);
    return entity;
  }

  public createFireBarrel(barrel: ReplicatedFirebarrel): Entity {
    return createFirebarrelEntity(barrel, this);
  }

  public enterFirebarrel(firebarrelId: string): void {
    console.log("enterFirebarrel");

    const playerNode = this.getPlayerNode();
    const firebarrelNode = this.getFirebarrelNode(firebarrelId);
    if (
      playerNode &&
      firebarrelNode &&
      playerNode.player.fsm.currentStateName !== playerNode.player.IMMOBILIZED
    ) {
      GameInstance.instance
        .getStore()
        .dispatch(setAnimateMapFireBarrel(firebarrelId));

      playerNode.entity.add(firebarrelNode.barrel);
      playerNode.player.fsm.changeState(playerNode.player.IMMOBILIZED);

      // TODO smooth go to firebarrel
      playerNode.position.x =
        firebarrelNode.position.x + firebarrelNode.collision.radius * 0.8;
      playerNode.position.y =
        firebarrelNode.position.y + firebarrelNode.collision.radius * 0.8;

      // setTimeout(() => {
      //   this.exitFirebarrel();
      // }, 10000);
    }
  }

  public exitFirebarrel(): void {
    console.log("exitFirebarrel");
    const playerNode = this.getPlayerNode();
    if (!playerNode) {
      return;
    }
    playerNode.entity.remove(BarrelComponent);
    playerNode.player.fsm.changeState(playerNode.player.FLYING);
    playerNode.entity.add(playerNode.player);
  }

  public createVenue(venue: ReplicatedVenue): Entity {
    return createVenueEntity(venue, this);
  }

  public removeVenue(venue: ReplicatedVenue) {
    const node = this.getVenueNode(venue);
    if (node) this.engine.removeEntity(node.entity);
  }

  public updateVenue(venue: ReplicatedVenue) {
    updateVenueEntity(venue, this);
  }

  public getVenueNode(venue: ReplicatedVenue): VenueNode | undefined {
    const nodes: NodeList<VenueNode> = this.engine.getNodeList(VenueNode);
    for (let node = nodes.head; node; node = node.next) {
      if (node.venue.model.data.id === venue.data.id) {
        return node;
      }
    }
    return undefined;
  }

  public createSoundEmitter(
    x: number,
    y: number,
    radius: number,
    src: string
  ): Entity {
    const entity: Entity = new Entity()
      .add(new PositionComponent(x, y))
      .add(new SoundEmitterComponent(radius, src));
    this.engine.addEntity(entity);

    return entity;
  }

  public removeEntity(entity: Entity) {
    this.engine.removeEntity(entity);
  }

  public getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min) + min);
  }

  public setPlayerCameraFollow(value: boolean) {
    const playerEntity = this.getPlayerNode()?.entity;

    if (value && !playerEntity?.get(ViewportFollowComponent))
      playerEntity?.add(new ViewportFollowComponent());

    if (!value && playerEntity?.get(ViewportFollowComponent))
      playerEntity?.remove(ViewportFollowComponent);
  }

  public getFirebarrelNode(id: string): BarrelNode | undefined {
    const nodes: NodeList<BarrelNode> = this.engine.getNodeList(BarrelNode);
    for (let node = nodes.head; node; node = node.next) {
      if (node.barrel.model.data.id === id) {
        return node;
      }
    }
    return undefined;
  }

  public removeBarrel(firebarrel: ReplicatedFirebarrel) {
    const node = this.getFirebarrelNode(firebarrel.data.id);
    if (node) this.engine.removeEntity(node.entity);
  }

  public updateBarrel(firebarrel: ReplicatedFirebarrel) {
    const node = this.getFirebarrelNode(firebarrel.data.id);
    if (!node) {
      return;
    }

    // TODO: update image, coords, etc
  }
}
