import { Engine, Entity, EntityStateMachine, NodeList } from "@ash.ts/ash";
import { RoundAvatar } from "../../commands/RoundAvatar";
import { BotComponent } from "../components/BotComponent";
import { CollisionComponent } from "../components/CollisionComponent";
import { MotionBotClickControlComponent } from "../components/MotionBotClickControlComponent";
import { MotionBotIdleComponent } from "../components/MotionBotIdleComponent";
import { MotionControlSwitchComponent } from "../components/MotionControlSwitchComponent";
import { MovementComponent } from "../components/MovementComponent";
import { PlayerComponent } from "../components/PlayerComponent";
import { PositionComponent } from "../components/PositionComponent";
import { SpriteComponent } from "../components/SpriteComponent";
import { VenueComponent } from "../components/VenueComponent";
import { ViewportFollowComponent } from "../components/ViewportFollowComponent";
import { ZoomedSpriteComponent } from "../components/ZoomedSpriteComponent";
import { PlayerNode } from "../nodes/PlayerNode";
import {
  PlayerModel,
  ReplicatedUser,
  ReplicatedVenue,
} from "store/reducers/AnimateMap";
import { ViewportNode } from "../nodes/ViewportNode";
import { ViewportComponent } from "../components/ViewportComponent";
import { JoystickComponent } from "../components/JoystickComponent";
import { JoystickNode } from "../nodes/JoystickNode";
import { KeyboardComponent } from "../components/KeyboardComponent";
import { KeyboardNode } from "../nodes/KeyboardNode";
import { MotionKeyboardControlComponent } from "../components/MotionKeyboardControlComponent";
import { BotNode } from "../nodes/BotNode";
import { MotionBotControlNode } from "../nodes/MotionBotControlNode";
import { SoundEmitterComponent } from "../components/SoundEmitterComponent";
import { ArtcarComponent } from "../components/ArtcarComponent";
import { GameInstance } from "../../GameInstance";
import { Point } from "types/utility";
import { EllipseComponent } from "../components/EllipseComponent";
import { HoverableSpriteComponent } from "../components/HoverableSpriteComponent";
import { ClickableSpriteComponent } from "../components/ClickableSpriteComponent";
import { setAnimateMapRoom } from "store/actions/AnimateMap";
import { TooltipComponent } from "../components/TooltipComponent";
import { FixScaleByViewportZoomComponent } from "../components/FixScaleByViewportZoomComponent";
import { BubbleComponent } from "../components/BubbleComponent";
import { AvatarTuningNode } from "../nodes/AvatarTuningNode";
import { AvatarTuningComponent } from "../components/AvatarTuningComponent";
import { Sprite } from "pixi.js";
import { avatarCycles } from "../../constants/AssetConstants";

export default class EntityFactory {
  private engine?: Engine | null = null;

  private fixScaleByViewportZoomComponent: FixScaleByViewportZoomComponent;

  constructor(engine: Engine | null = null) {
    this.engine = engine;
    this.fixScaleByViewportZoomComponent = new FixScaleByViewportZoomComponent([
      0.8,
      0.3,
      0.1,
    ]);
  }

  public getPlayerNode(): PlayerNode | null | undefined {
    return this.engine?.getNodeList(PlayerNode).head;
  }

  public getBotNode(id: string): BotNode | null {
    const bots: NodeList<BotNode> | undefined = this.engine?.getNodeList(
      BotNode
    );
    for (
      let bot: BotNode | null | undefined = bots?.head;
      bot;
      bot = bot.next
    ) {
      if (bot.bot.data.id === id) {
        return bot;
      }
    }
    return null;
  }

  public createViewport(comm: ViewportComponent): Entity {
    const nodelist: NodeList<ViewportNode> = this.engine!.getNodeList(
      ViewportNode
    );
    while (nodelist.head) {
      this.removeEntity(nodelist.head.entity);
    }

    const entity: Entity = new Entity().add(comm);
    this.engine!.addEntity(entity);
    return nodelist.head!.entity;
  }

  public updateViewport(comm: ViewportComponent | null = null): void {
    const nodelist: NodeList<ViewportNode> = this.engine!.getNodeList(
      ViewportNode
    );
    if (!nodelist.head) {
      return;
    }
    nodelist.head.entity.add(comm ? comm : nodelist.head.viewport);
  }

  public createJoystick(comm: JoystickComponent): Entity {
    const nodelist: NodeList<JoystickNode> = this.engine!.getNodeList(
      JoystickNode
    );
    while (nodelist.head) {
      this.removeEntity(nodelist.head.entity);
    }

    const entity: Entity = new Entity().add(comm);
    this.engine!.addEntity(entity);
    return entity;
  }

  public updateJoystick(comm: JoystickComponent | null = null): void {
    const nodelist: NodeList<JoystickNode> = this.engine!.getNodeList(
      JoystickNode
    );
    if (!nodelist.head) {
      return;
    }
    nodelist.head.entity.add(comm ? comm : nodelist.head.joystick);
  }

  public createKeyboard(
    comm: KeyboardComponent,
    control: MotionKeyboardControlComponent
  ): Entity {
    const nodelist: NodeList<KeyboardNode> = this.engine!.getNodeList(
      KeyboardNode
    );
    while (nodelist.head) {
      this.removeEntity(nodelist.head.entity);
    }

    const entity: Entity = new Entity().add(comm).add(control);
    this.engine!.addEntity(entity);
    return entity;
  }

  public updateKeyboard(comm: KeyboardComponent | null = null): void {
    const nodelist: NodeList<KeyboardNode> = this.engine!.getNodeList(
      KeyboardNode
    );
    if (!nodelist.head) {
      return;
    }
    nodelist.head.entity.add(comm ? comm : nodelist.head.keyboard);
  }

  public createBubble(userId: string, text: string): Entity | null {
    const bot: BotNode | null = this.getBotNode(userId);
    if (bot) {
      bot.entity.add(new BubbleComponent(text, bot.bot.data.data.dotColor));
      return bot.entity;
    }
    return null;
  }

  public removeBubble(entity: Entity): void {
    entity.remove(BubbleComponent);
  }

  public createPlayer(user: ReplicatedUser): Entity {
    let avatarUrlString = user.data.avatarUrlString;

    if (!Array.isArray(avatarUrlString)) {
      avatarUrlString = [avatarUrlString];
    }

    // HACK
    user.data.cycle = avatarCycles[0];

    const collision: CollisionComponent = new CollisionComponent(0);

    const entity: Entity = new Entity();
    const fsm: EntityStateMachine = new EntityStateMachine(entity);

    fsm.createState("flying");

    fsm.createState("cycling").add(CollisionComponent).withInstance(collision);

    fsm.createState("walking").add(CollisionComponent).withInstance(collision);

    entity
      .add(new PlayerComponent(user, fsm))
      .add(new MovementComponent())
      .add(new PositionComponent(user.x, user.y))
      .add(new MotionControlSwitchComponent())
      .add(new ViewportFollowComponent());

    fsm.changeState("flying");
    this.engine?.addEntity(entity);

    const padding = 20;
    const url = avatarUrlString.length > 0 ? avatarUrlString[0] : "";
    const sprite: Sprite = new Sprite();
    new RoundAvatar(url)
      .execute()
      .then((comm: RoundAvatar) => {
        // avatar
        const avatar: Sprite = Sprite.from(comm.canvas!);
        avatar.name = SpriteComponent.AVATAR;
        avatar.anchor.set(0.5);
        sprite.addChild(avatar);

        // halo
        const canvas = document.createElement("canvas");
        const size = comm.canvas!.width + padding * 2;
        canvas.width = size;
        canvas.height = size;
        const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fillStyle = "#7c46fb";
        ctx.fill();
        const halo: Sprite = Sprite.from(canvas);
        halo.name = SpriteComponent.HALO;
        halo.anchor.set(0.5);
        sprite.addChildAt(halo, 0);

        return Promise.resolve(comm);
      })
      .then((comm: RoundAvatar) => {
        const config = GameInstance.instance.getConfig();
        const size0 = config.getAvatarRadiusByZoomLevel(0) * 2;
        const size1 = config.getAvatarRadiusByZoomLevel(1) * 2;
        const size2 = config.getAvatarRadiusByZoomLevel(2) * 2;

        const spriteComponent: SpriteComponent = new SpriteComponent();
        spriteComponent.view = sprite;
        entity.add(spriteComponent);
        entity.add(
          new FixScaleByViewportZoomComponent([
            size0 / comm.canvas!.width,
            size1 / comm.canvas!.width,
            size2 / comm.canvas!.width,
          ])
        );
      });

    return entity;
  }

  public createArtcar(user: ReplicatedUser): Entity {
    let avatarUrlString = user.data.avatarUrlString;

    if (!Array.isArray(avatarUrlString)) {
      avatarUrlString = [avatarUrlString];
    }

    const config = GameInstance.instance.getConfig();
    let innerRadius = config.venuesMainCircleOuterRadius;
    let outerRadius = config.borderRadius;
    let worldCenter: Point = config.worldCenter;

    const angle = this.getRandomNumber(0, 360) * (Math.PI / 180);
    let radiusX = this.getRandomNumber(innerRadius, outerRadius);
    let radiusY = this.getRandomNumber(innerRadius, outerRadius);

    user.x = worldCenter.x + Math.cos(angle) * radiusX;
    user.y = worldCenter.y + Math.sin(angle) * radiusY;

    const entity: Entity = new Entity();
    const fsm: EntityStateMachine = new EntityStateMachine(entity);
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
      .add(new PositionComponent(user.x, user.y, 0))
      .add(new HoverableSpriteComponent());

    fsm.changeState("moving");
    this.engine?.addEntity(entity);

    const img: HTMLImageElement = new Image();
    const canvas: HTMLCanvasElement = document.createElement("canvas");
    const context: CanvasRenderingContext2D = canvas.getContext("2d")!;
    new Promise((resolve) => {
      img.addEventListener("load", () => {
        canvas.width = img.height;
        canvas.height = img.width;
        var x = canvas.width / 2;
        var y = canvas.height / 2;
        var width = img.width;
        var height = img.height;
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

      const config = GameInstance.instance.getConfig();
      const size0 = config.getAvatarRadiusByZoomLevel(0) * 8;
      const size1 = config.getAvatarRadiusByZoomLevel(1) * 8;
      const size2 = config.getAvatarRadiusByZoomLevel(2) * 8;
      entity.add(
        new FixScaleByViewportZoomComponent([
          size0 / canvas.width,
          size1 / canvas.width,
          size2 / canvas.width,
        ])
      );
    });

    return entity;
  }

  public updatePlayerTuning(node: PlayerNode): void {
    node.entity.add(new AvatarTuningComponent(node.player.data));
  }

  public removePlayerTuning(node: PlayerNode): void {
    node.entity.remove(AvatarTuningComponent);
  }

  public updateBotTuning(node: BotNode): void {
    node.entity.add(new AvatarTuningComponent(node.bot.data));
  }

  public removeAvatarTuning(node: AvatarTuningNode): void {
    node.entity.remove(AvatarTuningComponent);
  }

  public createBot(user: ReplicatedUser, realUser = false): Entity {
    let avatarUrlString = user.data.avatarUrlString;

    if (!Array.isArray(avatarUrlString)) {
      avatarUrlString = [avatarUrlString];
    }

    const point: Point = GameInstance.instance
      .getConfig()
      .playgroundMap.getRandomPointInTheCentralCircle();

    if (!realUser) {
      user.x = point.x;
      user.y = point.y;
    }

    const scale = 0.3;

    const entity: Entity = new Entity();
    const fsm: EntityStateMachine = new EntityStateMachine(entity);

    fsm
      .createState("idle")
      .add(MotionBotIdleComponent)
      .withInstance(new MotionBotIdleComponent());

    fsm
      .createState("moving")
      .add(MotionBotClickControlComponent)
      .add(MovementComponent)
      .withInstance(new MovementComponent());

    entity
      .add(new BotComponent(user, fsm, realUser))
      .add(new PositionComponent(user.x, user.y, 0, scale, scale))
      .add(
        new HoverableSpriteComponent(
          () => {
            // add tooltip
            entity.add(
              new TooltipComponent(
                `bot id: ${user.id}`.slice(0, 15) + "...",
                15,
                "top"
              )
            );
          },
          () => {
            // remove tooltip
            entity.remove(TooltipComponent);
          }
        )
      );

    fsm.changeState("moving");
    this.engine?.addEntity(entity);

    const url = avatarUrlString.length > 0 ? avatarUrlString[0] : "";
    const sprite: Sprite = new Sprite();
    new RoundAvatar(url)
      .execute()
      .then((comm: RoundAvatar) => {
        // avatar
        const avatar: Sprite = Sprite.from(comm.canvas!);
        avatar.name = SpriteComponent.AVATAR;
        avatar.anchor.set(0.5);
        sprite.addChild(avatar);
        return Promise.resolve(comm);
      })
      .then((comm: RoundAvatar) => {
        const config = GameInstance.instance.getConfig();
        const size0 = config.getAvatarRadiusByZoomLevel(0) * 2;
        const size1 = config.getAvatarRadiusByZoomLevel(1) * 2;
        const size2 = config.getAvatarRadiusByZoomLevel(2) * 2;

        const spriteComponent: SpriteComponent = new SpriteComponent();
        spriteComponent.view = sprite;
        entity.add(spriteComponent);
        entity.add(
          new FixScaleByViewportZoomComponent([
            size0 / comm.canvas!.width,
            size1 / comm.canvas!.width,
            size2 / comm.canvas!.width,
          ])
        );
      });

    return entity;
  }

  public removeBot(entity: Entity): void {
    this.engine?.removeEntity(entity);
  }

  public removeBotById(id: string): void {
    const list: NodeList<BotNode> = this.engine!.getNodeList(BotNode);
    for (let bot: BotNode | null | undefined = list.head; bot; bot = bot.next) {
      if (bot.bot.data.id === id) {
        this.removeBot(bot.entity);
        return;
      }
    }
  }

  public updateBotPosition(user: ReplicatedUser, x: number, y: number): void {
    const list: NodeList<BotNode> = this.engine!.getNodeList(BotNode);
    for (let bot: BotNode | null | undefined = list.head; bot; bot = bot.next) {
      if (bot.bot.data.id === user.id) {
        bot.bot.fsm.changeState("idle");
        bot.bot.fsm.changeState("moving");
        const node: MotionBotControlNode = this.engine!.getNodeList(
          MotionBotControlNode
        ).tail!;
        node.click.x = x;
        node.click.y = y;
        return;
      }
    }
  }

  public updateUserPositionById(userId: string, x: number, y: number): void {
    let bot: BotNode | null = this.getBotNode(userId);
    if (!bot) {
      const player: PlayerModel = new PlayerModel();
      player.id = userId;
      player.x = x;
      player.y = y;
      this.createBot(player, true);
      bot = this.engine?.getNodeList(BotNode).head!;
      bot.bot.fsm.changeState("idle");
    } else {
      this.updateBotPosition(bot.bot.data, x, y);
    }
  }

  public removeUserById(id: string): void {
    const node: BotNode | null = this.getBotNode(id);
    if (node) {
      this.removeEntity(node.entity);
    }
  }

  public createUser(hero: ReplicatedUser): Entity {
    const entity: Entity = new Entity().add(
      new PositionComponent(hero.x, hero.y)
    );

    this.engine?.addEntity(entity);
    return entity;
  }

  public createVenue(venue: ReplicatedVenue): Entity {
    let imageUrlString = venue.data.imageUrlString;

    // HACK for venue images
    const scale = 0.1;

    const entity: Entity = new Entity();
    entity
      .add(new VenueComponent(venue))
      .add(new SpriteComponent())
      .add(new ZoomedSpriteComponent([imageUrlString]))
      .add(new PositionComponent(venue.x, venue.y, 0, scale, scale))
      .add(
        new HoverableSpriteComponent(
          () => {
            // add tooltip
            entity.add(
              new TooltipComponent(
                ("venue id: " + venue.id).slice(0, 15) + "..."
              )
            );
          },
          () => {
            // remove tooltip
            entity.remove(TooltipComponent);
          }
        )
      )
      .add(
        new ClickableSpriteComponent(() => {
          GameInstance.instance.getStore().dispatch(
            setAnimateMapRoom({
              title: "Title " + venue.data.url.slice(4),
              subtitle: "Subtitle ",
              url: venue.data.url,
              about: "about text #",
              x_percent: 50,
              y_percent: 50,
              width_percent: 5,
              height_percent: 5,
              isEnabled: true,
              image_url: venue.data.imageUrlString,
            })
          );
        })
      )
      .add(new CollisionComponent(50));
    this.engine?.addEntity(entity);

    return entity;
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
    this.engine?.addEntity(entity);

    return entity;
  }

  public removeEntity(entity: Entity): void {
    this.engine?.removeEntity(entity);
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
}
