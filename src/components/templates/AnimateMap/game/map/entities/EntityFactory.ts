import { Engine, Entity, NodeList } from "@ash.ts/ash";
import { Sprite } from "pixi.js";

import { setAnimateMapFireBarrel } from "store/actions/AnimateMap";

import { ImageToCanvas } from "../../commands/ImageToCanvas";
import { LoadImage } from "../../commands/LoadImage";
import { RoundAvatar } from "../../commands/RoundAvatar";
import {
  GameArtcar,
  GameControls,
  GameFirebarell,
  GameUser,
  GameVenue,
} from "../../common";
import { avatarCycles } from "../../constants/AssetConstants";
import { AvatarTuningComponent } from "../components/AvatarTuningComponent";
import { BubbleComponent } from "../components/BubbleComponent";
import { CollisionComponent } from "../components/CollisionComponent";
import { DeadComponent } from "../components/DeadComponent";
import { FirebarrelComponent } from "../components/FirebarrelComponent";
import { JoystickComponent } from "../components/JoystickComponent";
import { KeyboardComponent } from "../components/KeyboardComponent";
import { MotionControlSwitchComponent } from "../components/MotionControlSwitchComponent";
import { MotionKeyboardControlComponent } from "../components/MotionKeyboardControlComponent";
import { MotionTeleportComponent } from "../components/MotionTeleportComponent";
import { MovementComponent } from "../components/MovementComponent";
import { PlayerComponent } from "../components/PlayerComponent";
import { PositionComponent } from "../components/PositionComponent";
import { SoundEmitterComponent } from "../components/SoundEmitterComponent";
import { SpriteComponent } from "../components/SpriteComponent";
import { TooltipComponent } from "../components/TooltipComponent";
import { ViewportComponent } from "../components/ViewportComponent";
import { ViewportFollowComponent } from "../components/ViewportFollowComponent";
import { WaitingArtcarEnterClickComponent } from "../components/WaitingArtcarEnterClickComponent";
import { WaitingVenueClickComponent } from "../components/WaitingVenueClickComponent";
import { FSMBase } from "../finalStateMachines/FSMBase";
import { Avatar } from "../graphics/Avatar";
import { VenueTooltipEnter } from "../graphics/VenueTooltipEnter";
import { ArtcarNode } from "../nodes/ArtcarNode";
import { AvatarTuningNode } from "../nodes/AvatarTuningNode";
import { BotNode } from "../nodes/BotNode";
import { FirebarrelNode } from "../nodes/FirebarrelNode";
import { JoystickNode } from "../nodes/JoystickNode";
import { KeyboardNode } from "../nodes/KeyboardNode";
import { MotionBotControlNode } from "../nodes/MotionBotControlNode";
import { PlayerNode } from "../nodes/PlayerNode";
import { VenueNode } from "../nodes/VenueNode";
import { ViewportNode } from "../nodes/ViewportNode";
import { WaitingVenueClickNode } from "../nodes/WaitingVenueClickNode";

import { createArtcarEntity } from "./createArtcarEntity";
import { createBotEntity } from "./createBotEntity";
import {
  createFirebarrelEntity,
  updateFirebarrelEntity,
} from "./createFirebarrelEntity";
import { createVenueEntity, updateVenueEntity } from "./createVenueEntity";

export default class EntityFactory {
  public engine: Engine;
  public controls: GameControls;

  constructor(controls: GameControls, engine: Engine) {
    this.controls = controls;
    this.engine = engine;
  }

  public createWaitingArtcarClick(artcar: GameArtcar): Entity | undefined {
    const nodes = this.engine.getNodeList(WaitingVenueClickNode);
    while (nodes.head) {
      this.engine.removeEntity(nodes.head.entity);
    }

    const venueNode = this.getArtcarNode(artcar.data.id);
    if (!venueNode) {
      return undefined;
    }

    const tooltip = new TooltipComponent("", 50);
    tooltip.view = new VenueTooltipEnter(
      venueNode.artcar.artcar.data.title,
      0x6943f5
    );

    const spriteComponent = new SpriteComponent();
    spriteComponent.view = new Sprite();

    const entity = new Entity()
      .add(new WaitingArtcarEnterClickComponent(artcar))
      .add(new DeadComponent(250))
      .add(spriteComponent)
      .add(venueNode.position)
      .add(tooltip);

    this.engine.addEntity(entity);

    // removeAllTooltip on this venue
    venueNode.entity.remove(TooltipComponent);

    return entity;
  }

  public createWaitingVenueClick(venue: GameVenue): Entity | undefined {
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

  public getWaitingVenueClick(): GameVenue | undefined {
    return this.engine.getNodeList(WaitingVenueClickNode).head?.venue.venue;
  }

  public getPlayerNode(): PlayerNode | null {
    return this.engine.getNodeList(PlayerNode).head;
  }

  public getRandomBot(): GameUser | undefined {
    const bots = this.controls.getUsers();
    console.log("bots => ", bots);
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

  public createShout(x: number, y: number, text: string): Entity {
    console.log("CREATE SHOUT");
    // TODO refactoring
    const spriteComponent = new SpriteComponent();
    const view = new Sprite();
    view.position.set(x, y);

    const entity = new Entity()
      .add(new DeadComponent(100))
      .add(new BubbleComponent(text))
      .add(new PositionComponent(x, y))
      .add(spriteComponent);
    this.engine.addEntity(entity);
    return entity;
  }

  public createBubble(userId: string, text: string): Entity | null {
    const bot = this.getBotNode(userId);
    const player = this.getPlayerNode();
    if (bot) {
      bot.entity.add(new BubbleComponent(text, bot.bot.data.data.dotColor));
      return bot.entity;
    }
    if (player) {
      player.entity.add(new BubbleComponent(text));
    }
    return null;
  }

  public removeBubble(entity: Entity) {
    entity.remove(BubbleComponent);
  }

  public createPlayer(user: GameUser): Entity {
    // HACK
    user.data.cycle = avatarCycles[0];

    const movementComponent = new MovementComponent();
    const motionControl = new MotionControlSwitchComponent();
    const collision: CollisionComponent = new CollisionComponent(0);

    const scale = 0.36;

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

    fsm.changeState(player.FLYING);
    this.engine.addEntity(entity);

    const url = user.data.pictureUrl;
    const sprite: Avatar = new Avatar();

    if (this.controls.getConfig().AVATAR_TEXTURE_USE_WITHOUT_PREPROCESSING) {
      new LoadImage(url)
        .execute()
        .then((comm) => {
          if (comm.image) {
            return new ImageToCanvas(comm.image).execute();
          } else {
            return Promise.reject();
          }
        })
        .then((comm) => {
          if (comm.canvas) {
            // avatar
            sprite.avatar = Sprite.from(comm.canvas);
            sprite.avatar.anchor.set(0.5);
            sprite.addChild(sprite.avatar);
          }
        })
        .catch((error) => {})
        .finally(() => {
          const spriteComponent: SpriteComponent = new SpriteComponent();
          spriteComponent.view = sprite;
          entity.add(spriteComponent);
        });
    } else {
      new RoundAvatar(this.controls, url)
        .execute()
        .then((comm: RoundAvatar) => {
          if (!comm.canvas) return Promise.reject();

          // avatar
          sprite.avatar = Sprite.from(comm.canvas);
          sprite.avatar.anchor.set(0.5);
          sprite.addChild(sprite.avatar);

          return Promise.resolve(comm);
        })
        .catch(() => {})
        .finally(() => {
          const spriteComponent: SpriteComponent = new SpriteComponent();
          spriteComponent.view = sprite;
          entity.add(spriteComponent);
        });
    }

    return entity;
  }

  public createArtcar(user: GameArtcar): Entity {
    return createArtcarEntity(user, this);
  }

  public getArtcarNode(id: number): ArtcarNode | undefined {
    const nodes = this.engine.getNodeList(ArtcarNode);
    for (let node = nodes.head; node; node = node.next) {
      if (node.artcar.artcar.data.id === id) {
        return node;
      }
    }
    return undefined;
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

  public createBot(user: GameUser, realUser = false): Entity {
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

  public updateBotPosition(user: GameUser, x: number, y: number) {
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

  public updateUserPositionById(user: GameUser) {
    let bot: BotNode | null = this.getBotNode(user.data.id);
    if (!bot) {
      // const player: PlayerModel = new PlayerModel(user, -1, "", x, y);
      // player.data.id = user;
      // player.x = x;
      // player.y = y;
      this.createBot(user, true);
      bot = this.engine.getNodeList(BotNode).head as BotNode;
      bot.bot.fsm.changeState("idle");
    } else {
      this.updateBotPosition(bot.bot.data, user.x, user.y); //TODO: update another field too?
    }
  }

  public removeUserById(id: string) {
    const node: BotNode | null = this.getBotNode(id);
    if (node) {
      this.removeEntity(node.entity);
    }
  }

  public createUser(hero: GameUser): Entity {
    const entity: Entity = new Entity().add(
      new PositionComponent(hero.x, hero.y)
    );

    this.engine.addEntity(entity);
    return entity;
  }

  public createFireBarrel(barrel: GameFirebarell): Entity {
    const node = this.getFirebarrelNode(barrel.data.id);
    if (node) return node.entity;
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
      this.controls.dispatch(setAnimateMapFireBarrel(firebarrelId));

      playerNode.entity.add(firebarrelNode.firebarrel);
      playerNode.player.fsm.changeState(playerNode.player.IMMOBILIZED);

      const x1 = firebarrelNode.position.x;
      const y1 = firebarrelNode.position.y;
      const x2 = playerNode.position.x;
      const y2 = playerNode.position.y;
      const d = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
      const r = (firebarrelNode.collision.radius * 1.6) / d;

      const x3 =
        r * x2 + (1 - r) * x1 ||
        firebarrelNode.position.x + firebarrelNode.collision.radius * 0.8;
      const y3 =
        r * y2 + (1 - r) * y1 ||
        firebarrelNode.position.y + firebarrelNode.collision.radius * 0.8;

      playerNode.entity.add(new MotionTeleportComponent(x3, y3));

      // setTimeout(() => {
      //   this.exitFirebarrel();
      // }, 5000);
    }
  }

  public exitFirebarrel(): void {
    console.log("exitFirebarrel");
    const playerNode = this.getPlayerNode();

    if (!playerNode) {
      return;
    }
    const barrelComponent = playerNode.entity.remove(FirebarrelComponent);
    playerNode.player.fsm.changeState(playerNode.player.FLYING);
    playerNode.entity.add(playerNode.player);

    if (barrelComponent) {
      const x1 = barrelComponent.model.x;
      const y1 = barrelComponent.model.y;
      const x2 = playerNode.position.x;
      const y2 = playerNode.position.y;

      const x3 = playerNode.position.x + (x2 - x1) * 2;
      const y3 = playerNode.position.y + (y2 - y1) * 2;

      playerNode.entity.add(new MotionTeleportComponent(x3, y3));
    }
  }

  public createVenue(venue: GameVenue): Entity {
    const node = this.getVenueNode(venue);
    if (node) return node.entity;
    return createVenueEntity(venue, this);
  }

  public removeVenue(venue: GameVenue) {
    const node = this.getVenueNode(venue);
    if (node) this.engine.removeEntity(node.entity);
  }

  public updateVenue(venue: GameVenue) {
    updateVenueEntity(venue, this);
  }

  public getVenueNode(venue: GameVenue): VenueNode | undefined {
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

  public getFirebarrelNode(id: string): FirebarrelNode | undefined {
    const nodes: NodeList<FirebarrelNode> = this.engine.getNodeList(
      FirebarrelNode
    );
    for (let node = nodes.head; node; node = node.next) {
      if (node.firebarrel.model.data.id === id) {
        return node;
      }
    }
    return undefined;
  }

  public removeBarrel(firebarrel: GameFirebarell) {
    const node = this.getFirebarrelNode(firebarrel.data.id);
    if (node) this.engine.removeEntity(node.entity);
  }

  public updateBarrel(firebarrel: GameFirebarell) {
    const node = this.getFirebarrelNode(firebarrel.data.id);
    if (!node) {
      return;
    }

    updateFirebarrelEntity(firebarrel, this);
  }
}
