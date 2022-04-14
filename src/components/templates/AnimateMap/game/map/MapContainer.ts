import { Engine } from "@ash.ts/ash";
import { Application, Container } from "pixi.js";
import { Viewport } from "pixi-viewport";

import { setAnimateMapPointer } from "store/actions/AnimateMap";
import { ReplicatedUser } from "store/reducers/AnimateMap";

import { Point } from "types/utility";

import playerModel from "../../bridges/DataProvider/Structures/PlayerModel";
import EventProvider, {
  EventType,
} from "../../bridges/EventProvider/EventProvider";
import { TimeoutCommand } from "../commands/TimeoutCommand";
import { GameControls } from "../common";
import { MAP_JSON, sounds } from "../constants/AssetConstants";
import { stubArtcarsData } from "../constants/StubData";
import { GameInstance } from "../GameInstance";
import KeyPoll from "../utils/KeyPollSingleton";
import { PlaygroundMap } from "../utils/PlaygroundMap";

import EntityFactory from "./entities/EntityFactory";
import { AnimationNode } from "./nodes/AnimationNode";
import { AnimationSystem } from "./systems/AnimationSysem";
import { AvatarTuningSystem } from "./systems/AvatarTuningSystem";
import { BubbleSystem } from "./systems/BubbleSystem";
import { ClickableSpriteSystem } from "./systems/ClickableSpriteSystem";
import { DeadSystem } from "./systems/DeadSystem";
import { DebugSystem } from "./systems/DebugSystem";
import { FirebarrelSystem } from "./systems/FirebarrelSystem";
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
import { VenueSystem } from "./systems/VenueSystem";
import { ViewportBackgroundSystem } from "./systems/ViewportBackgroundSystem";
import { ViewportSystem } from "./systems/ViewportSystem";

export class MapContainer extends Container {
  private readonly _controls: GameControls;

  private readonly _app: Application;

  private _viewport?: Viewport;

  private _engine?: Engine;
  public entityFactory?: EntityFactory;
  public _entityContainer?: Container;
  private _tooltipContainer?: Container;
  private _bubbleContainer?: Container;

  private _joystickContainer?: Container;

  private _debugContainer?: Container;

  private _player: ReplicatedUser | undefined;

  constructor(app: Application, controls: GameControls) {
    super();

    this._controls = controls;
    this._app = app;

    if (
      playerModel.x !== 0 &&
      playerModel.y !== 0 &&
      playerModel.data.id !== ""
    ) {
      this._player = playerModel;
    } else {
      const clbck = (player: ReplicatedUser) => {
        this._player = player;
        EventProvider.off(EventType.PLAYER_MODEL_READY, clbck);
      };
      EventProvider.on(EventType.PLAYER_MODEL_READY, clbck);
    }
  }

  public async start(): Promise<void> {
    await this.initEntities().then(() => {
      if (this._player) {
        this.entityFactory?.createPlayer(this._player);
      }
    });
  }

  public async init(): Promise<void> {
    this.initViewport();
    this.initViewportLayers();
    this.initSystems();
    this.initMap(MAP_JSON);

    this._viewport?.on("clicked", (e: { world: Point }) =>
      this._controls.dispatch(
        setAnimateMapPointer({
          x: e.world.x,
          y: e.world.y,
        })
      )
    );
  }

  private initViewport() {
    this._viewport = new Viewport({ noTicker: true, divWheel: this._app.view });
    this.addChild(this._viewport);
  }

  private initViewportLayers() {
    this._debugContainer = new Container(); //TODO: maybe relocate all instantiate to constructor?
    this._viewport?.addChild(this._debugContainer);

    this._entityContainer = new Container();
    this._viewport?.addChild(this._entityContainer);
  }

  private initSystems() {
    this._tooltipContainer = new Container();
    this.addChild(this._tooltipContainer);
    this._bubbleContainer = new Container();
    this.addChild(this._bubbleContainer);
    this._joystickContainer = new Container();
    this.addChild(this._joystickContainer);

    // const keyPoll = keyPoll;
    this._engine = new Engine();
    this.entityFactory = new EntityFactory(this._engine);

    this._engine.addSystem(new VenueSystem(), SystemPriorities.update);
    this._engine.addSystem(
      new DeadSystem(this._engine),
      SystemPriorities.update
    );
    this._engine.addSystem(new VenueSystem(), SystemPriorities.update);
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
      new MotionJoystickSystem(this._joystickContainer, this.entityFactory),
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

    if (this._debugContainer && this._viewport) {
      this._engine.addSystem(
        new DebugSystem(
          this._debugContainer,
          this.entityFactory,
          this._viewport
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
      new MotionCollisionSystem(this.entityFactory),
      SystemPriorities.resolveCollisions
    );

    this._engine.addSystem(
      new AnimationSystem(AnimationNode),
      SystemPriorities.animate
    );

    this._engine.addSystem(
      new SpriteSystem(this._entityContainer),
      SystemPriorities.render
    );
    this._engine.addSystem(
      new HoverableSpriteSystem(this._entityContainer as Container),
      SystemPriorities.render
    );
    this._engine.addSystem(
      new ClickableSpriteSystem(this._entityContainer as Container),
      SystemPriorities.render
    );
    this._engine.addSystem(
      new TooltipSystem(this._tooltipContainer),
      SystemPriorities.render
    );
    this._engine.addSystem(
      new BubbleSystem(this._bubbleContainer, this.entityFactory),
      SystemPriorities.render
    );

    this._engine.addSystem(
      new ViewportSystem(
        this._controls,
        this._app,
        this._viewport as Viewport,
        this.entityFactory
      ),
      SystemPriorities.render
    );
    this._engine.addSystem(
      new ViewportBackgroundSystem(this._viewport as Viewport, this._app),
      SystemPriorities.render
    );
    this._engine.addSystem(
      new FirebarrelSystem(this.entityFactory),
      SystemPriorities.render
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private initMap(config: any) {
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

  private initEntities(): Promise<void> {
    if (!this.entityFactory) {
      return Promise.reject();
    }

    return (
      new TimeoutCommand(1000)
        .execute()
        .then(() => {
          if (this.entityFactory) {
            GameInstance.instance.dataProvider.firebarrelsData.forEach(
              (firebarrel) => {
                this.entityFactory?.createFireBarrel(firebarrel);
              }
            );
          }
        })
        .then(() => {
          if (this.entityFactory) {
            const map: PlaygroundMap = GameInstance.instance.playgroundMap;
            const bots = this._controls.getUsers();
            const itrb: IterableIterator<ReplicatedUser> = bots.values();
            const self: MapContainer = this;
            const loop = async () => {
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
            };
            loop();
          }
          return Promise.resolve();
        })
        .then(() => {
          if (this.entityFactory) {
            const venue = GameInstance.instance.dataProvider.venuesData;
            venue.forEach((venue) => {
              this.entityFactory?.createVenue(venue);
            });
          }
          return Promise.resolve();
        })
        .then(() => {
          return new TimeoutCommand(1000).execute();
        })
        // .then(() => {
        //   if (this.entityFactory) {
        //     const config = GameInstance.instance.getConfig();
        //     if (playerModel.x < 0 || playerModel.x > config.worldWidth) {
        //       playerModel.x = config.worldWidth / 2;
        //     }
        //     if (playerModel.y < 0 || playerModel.y > config.worldHeight) {
        //       playerModel.y = config.worldHeight / 2;
        //     }
        //     this.entityFactory.createPlayer(playerModel);
        //   }
        // })
        .then(() => {
          return new TimeoutCommand(1000).execute();
        })
        .then(() => {
          if (this.entityFactory) {
            const self: MapContainer = this;
            const artcars = stubArtcarsData();
            const loop = async () => {
              for (let i = 0; i < artcars.length; i++) {
                await new Promise((resolve) => {
                  self.entityFactory?.createArtcar(artcars[i]);
                  setTimeout(() => {
                    resolve(true);
                  }, 30);
                });
              }
            };
            loop();
          }
        })
    );
  }

  public resize(width: number, height: number) {
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

  private releaseLayers() {}

  private releaseSystems() {
    this._engine?.removeAllEntities();
    this._engine?.removeAllSystems();
  }

  public update(dt: number) {
    this._engine?.update(dt);
  }
}
