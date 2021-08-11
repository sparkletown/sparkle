import { Engine } from "@ash.ts/ash";
import { Application, Container } from "pixi.js";
import { Viewport } from "pixi-viewport";

import { setAnimateMapPointer } from "store/actions/AnimateMap";
import { PlayerModel, ReplicatedUser } from "store/reducers/AnimateMap";

import playerModel from "../../bridges/DataProvider/Structures/PlayerModel";
import { TimeoutCommand } from "../commands/TimeoutCommand";
import { artcars, MAP_JSON, sounds } from "../constants/AssetConstants";
import { GameInstance } from "../GameInstance";
import KeyPoll from "../utils/KeyPollSingleton";
import { PlaygroundMap } from "../utils/PlaygroundMap";
import { Point } from "../utils/Point";

import EntityFactory from "./entities/EntityFactory";
import { AvatarTuningSystem } from "./systems/AvatarTuningSystem";
import { BubbleSystem } from "./systems/BubbleSystem";
import { ClickableSpriteSystem } from "./systems/ClickableSpriteSystem";
import { DebugSystem } from "./systems/DebugSystem";
import { FixScaleByViewportZoomSystem } from "./systems/FixScaleByViewportZoomSystem";
import { HoverableSpriteSystem } from "./systems/HoverableSpriteSystem";
import { LineOfSightSystem } from "./systems/LineOfSightSystem";
import { MotionArtcarSystem } from "./systems/MotionArtcarSystem";
import { MotionBotSystem } from "./systems/MotionBotSystem";
import { MotionClickSystem } from "./systems/MotionClickSystem";
import { MotionCollisionSystem } from "./systems/MotionCollisionSystem";
import { MotionControlSwitchSystem } from "./systems/MotionControlSwitchSystem";
import { MotionJoystickSystem } from "./systems/MotionJoystickSystem";
import { MotionKeyboardSystem } from "./systems/MotionKeyboardSystem";
import { MotionTeleportSystem } from "./systems/MotionTeleportSystem";
import { MovementSystem } from "./systems/MovementSystem";
import { SoundEmitterSystem } from "./systems/SoundEmitterSystem";
import { SpriteSystem } from "./systems/SpriteSystem";
import { SystemPriorities } from "./systems/SystemPriorities";
import { TooltipSystem } from "./systems/TooltipSystem";
import { ViewportBackgroundSystem } from "./systems/ViewportBackgroundSystem";
import { ViewportSystem } from "./systems/ViewportSystem";
import { ZoomedSpriteSystem } from "./systems/ZoomedSpriteSystem";

export class MapContainer extends Container {
  private _app?: Application | null = null;

  private _viewport?: Viewport | null = null;

  private _engine?: Engine | null = null;
  public entityFactory?: EntityFactory | null = null;
  public _entityContainer?: Container | null = null;
  private _tooltipContainer?: Container | null = null;
  private _bubbleContainer?: Container | null = null;

  private _joystickContainer?: Container | null = null;

  private _debugContainer?: Container | null = null;

  constructor(app: Application | null) {
    super();

    this._app = app;
  }

  public async start(): Promise<void> {
    await this.initEntities();
  }

  public async init(): Promise<void> {
    this.initViewport();
    this.initViewportLayers();

    this._tooltipContainer = new Container();
    this.addChild(this._tooltipContainer);
    this._bubbleContainer = new Container();
    this.addChild(this._bubbleContainer);

    this.initJoystick();
    this.initSystems();
    this.initMap(MAP_JSON);

    this._viewport?.on("clicked", (e) =>
      GameInstance.instance.getStore().dispatch(
        setAnimateMapPointer({
          //@ts-ignore
          x: e.world.x,
          //@ts-ignore
          y: e.world.y,
        })
      )
    );
  }

  private initJoystick(): void {
    this._joystickContainer = new Container();
    this.addChild(this._joystickContainer);
  }

  private initViewport(): void {
    this._viewport = new Viewport({ noTicker: true });
    this.addChild(this._viewport);
  }

  private initViewportLayers(): void {
    this._debugContainer = new Container();
    this._viewport?.addChild(this._debugContainer);

    this._entityContainer = new Container();
    this._viewport?.addChild(this._entityContainer);
  }

  private initSystems(): void {
    // const keyPoll = keyPoll;
    this._engine = new Engine();
    this.entityFactory = new EntityFactory(this._engine);

    this._engine.addSystem(
      new MotionControlSwitchSystem(),
      SystemPriorities.update
    );
    this._engine.addSystem(
      new MotionKeyboardSystem(KeyPoll, this.entityFactory),
      SystemPriorities.update
    );
    this._engine.addSystem(
      new MotionClickSystem(this.entityFactory),
      SystemPriorities.update
    );
    this._engine.addSystem(
      new MotionTeleportSystem(this.entityFactory),
      SystemPriorities.update
    );
    this._engine.addSystem(
      new MotionJoystickSystem(this._joystickContainer!, this.entityFactory),
      SystemPriorities.update
    );
    this._engine.addSystem(
      new FixScaleByViewportZoomSystem(),
      SystemPriorities.update
    );
    this._engine.addSystem(
      new MotionBotSystem(this.entityFactory),
      SystemPriorities.update
    );

    this._engine.addSystem(
      new MotionArtcarSystem(this.entityFactory),
      SystemPriorities.update
    );
    this._engine.addSystem(new SoundEmitterSystem(), SystemPriorities.update);
    this._engine.addSystem(
      new AvatarTuningSystem(this.entityFactory),
      SystemPriorities.update
    );

    if (this._debugContainer) {
      this._engine.addSystem(
        new DebugSystem(
          this._debugContainer,
          this.entityFactory,
          this._viewport!
        ),
        SystemPriorities.move
      );
    }

    this._engine.addSystem(new MovementSystem(), SystemPriorities.move);
    this._engine.addSystem(
      new LineOfSightSystem(this.entityFactory),
      SystemPriorities.move
    );
    this._engine.addSystem(
      new MotionCollisionSystem(),
      SystemPriorities.resolveCollisions
    );

    this._engine.addSystem(
      new SpriteSystem(this._entityContainer),
      SystemPriorities.render
    );
    this._engine.addSystem(
      new HoverableSpriteSystem(this._entityContainer!),
      SystemPriorities.render
    );
    this._engine.addSystem(
      new ClickableSpriteSystem(this._entityContainer!),
      SystemPriorities.render
    );
    this._engine.addSystem(
      new TooltipSystem(this._tooltipContainer!),
      SystemPriorities.render
    );
    this._engine.addSystem(
      new BubbleSystem(this._bubbleContainer!, this.entityFactory),
      SystemPriorities.render
    );

    this._engine.addSystem(new ZoomedSpriteSystem(), SystemPriorities.render);
    this._engine.addSystem(
      new ViewportSystem(this._app!, this._viewport!, this.entityFactory),
      SystemPriorities.render
    );
    this._engine.addSystem(
      new ViewportBackgroundSystem(this._viewport!),
      SystemPriorities.render
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private initMap(config: any): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const objectsLayer = config.layers.find((o: any) => o.name === "objects");

    if (objectsLayer) {
      const objectsData = objectsLayer.objects;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      objectsData.forEach((objectData: any) => {
        const width = objectData.width ?? 0;
        const height = objectData.height ?? 0;
        const x = objectData.x + width / 2 ?? 0;
        const y = objectData.y + height / 2 ?? 0;

        const props = objectData.properties;

        if (props) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const typeProp = props.find((o: any) => o.name === "type");

          if (typeProp) {
            const type = typeProp.value;

            switch (type) {
              case "sound": {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const soundProp = props.find((o: any) => o.name === "sound");

                if (soundProp) {
                  const sound = soundProp.value;

                  if (sounds.hasOwnProperty(sound)) {
                    this.entityFactory?.createSoundEmitter(
                      x,
                      y,
                      Math.min(width, height),
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      (sounds as any)[sound]
                    );
                  }
                }
              }
            }
          }
        }
      });
    }
  }

  private initEntities(): void {
    if (!this.entityFactory) {
      return;
    }

    new TimeoutCommand(1000)
      .execute()
      .then(() => {
        if (this.entityFactory) {
          const map: PlaygroundMap = GameInstance.instance.getConfig()
            .playgroundMap;
          const bots: Map<
            string,
            ReplicatedUser
          > = GameInstance.instance.getState().users;
          const itrb: IterableIterator<ReplicatedUser> = bots.values();
          const self: MapContainer = this;
          (async function loop() {
            for (
              let bot: ReplicatedUser = itrb.next().value;
              bot;
              bot = itrb.next().value
            ) {
              await new Promise((resolve) => {
                const point: Point = map.getRandomPointOnThePlayground();
                bot.x = point.x;
                bot.y = point.y;
                self.entityFactory?.createBot(bot);
                setTimeout(() => {
                  resolve(true);
                }, 30);
              });
            }
          })();
        }
        return Promise.resolve();
      })
      .then(() => {
        return new TimeoutCommand(1000).execute();
      })
      .then(() => {
        if (this.entityFactory) {
          const config = GameInstance.instance.getConfig();
          if (playerModel.x < 0 || playerModel.x > config.worldWidth) {
            playerModel.x = config.worldWidth / 2;
          }
          if (playerModel.y < 0 || playerModel.y > config.worldHeight) {
            playerModel.y = config.worldHeight / 2;
          }
          this.entityFactory.createPlayer(playerModel);
        }
      })
      .then(() => {
        return new TimeoutCommand(1000).execute();
      })
      .then(() => {
        if (this.entityFactory) {
          const self: MapContainer = this;
          (async function loop() {
            for (let i = 0; i < artcars.length; i++) {
              await new Promise((resolve) => {
                const user: PlayerModel = new PlayerModel();
                user.id = `${i}${Date.now()}`;
                user.data.avatarUrlString = artcars[i];
                self.entityFactory?.createArtcar(user);
                setTimeout(() => {
                  resolve(true);
                }, 30);
              });
            }
          })();
        }
      });
  }

  public resize(width: number, height: number): void {
    if (this._viewport) {
      this._viewport.resize(width, height);
    }
    if (this._joystickContainer) {
      this._joystickContainer.position.set(86, height - 86);
    }
  }

  public async release(): Promise<void> {
    this.releaseSystems();
    this.releaseLayers();
  }

  private releaseLayers(): void {}

  private releaseSystems(): void {
    this._engine?.removeAllEntities();
    this._engine?.removeAllSystems();
  }

  public update(dt: number): void {
    this._engine?.update(dt);
  }
}
