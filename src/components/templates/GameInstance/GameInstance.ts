import {
  Application,
  Container,
  Loader,
  LoaderResource,
  Renderer,
  settings,
} from "pixi.js";

import { Point } from "types/utility";

import { DataProvider, DataProviderEvent } from "../DataProvider";
import { EventProvider, EventType } from "../EventProvider";
import { GameConfig } from "../GameConfig";
import {
  AnimateMapActionTypes,
  ReplicatedFirebarrel,
  ReplicatedUser,
  ReplicatedVenue,
  setAnimateMapEnvironmentSoundAction,
  subscribeActionAfter,
} from "../GameInstanceCommonInterfaces";
import { GameInstanceInterface } from "../GameInstanceInterface";
import { GameInstanceProvider } from "../GameInstanceProvider";

import { TimeoutCommand } from "./commands/TimeoutCommand";
import WaitClickForHeroCreation from "./commands/WaitClickForHeroCreation";
import { assets } from "./consts/AssetConstants";
import { MapContainer } from "./map/MapContainer";
import { StartPoint } from "./utils/Point";
import { stubUsersData } from "./consts";

// @debt do not create objects on load time, but only in the constructor.
// Globals (or module level) constants like mapLightningShader and mapStaticLightningShader
// will cause an error on devices/browsers that don't support WebGL 2
export class GameInstance implements GameInstanceInterface {
  public static DEBOUNCE_TIME: number = 25;

  public static instance: GameInstance;

  private _app?: Application;
  private _renderer?: Renderer;

  private _stage?: Container;
  public _mapContainer?: MapContainer;
  private _eventProvider = EventProvider;

  public gameInstanceProvider: GameInstanceProvider;

  public dataProvider: DataProvider;

  get eventProvider() {
    return this._eventProvider;
  }

  constructor(args: GameInstanceProvider) {
    if (GameInstance.instance) console.error("Multiply instancing!");

    this.gameInstanceProvider = args;
    this.dataProvider = args.dataProvider;

    GameInstance.instance = this;
  }

  public async init(): Promise<void> {
    await this.initRenderer();
    await this.loadAssets(assets);
    await this.initMap();
    this._subscribes();
  }

  private async initRenderer(): Promise<void> {
    this._app = new Application({
      transparent: true,
      antialias: true,
      resizeTo: this.gameInstanceProvider.containerElement,
      backgroundColor: 0xe7d4c3,
      resolution: 1,
    });

    this._renderer = this._app.renderer;
    this._stage = this._app.stage;

    this.gameInstanceProvider.containerElement.appendChild(this._app.view);
  }

  private async initMap(): Promise<void> {
    if (!this._app) return console.error();
    this.gameInstanceProvider.handleSetAnimateMapUsers(stubUsersData());

    this._mapContainer = new MapContainer(this._app);
    this._stage?.addChild(this._mapContainer);
    return await this._mapContainer.init();
  }

  private loadAssets(resources: string[]): Promise<void> {
    return new Promise((resolve) => {
      resources.forEach((url) => {
        this._app?.loader.add(url);
      });

      this._app?.loader.onComplete.add(() => {
        resolve();
      });
      this._app?.loader.onError.add(
        (loader: Loader, resource: LoaderResource) => console.error(resource)
      );

      this._app?.loader.load();
    });
  }

  // private async fillPlayerData(point: Point) {
  //   return this.dataProvider.initPlayerPositionAsync(point.x, point.y);
  // }

  public async start(): Promise<void> {
    if (!this._app) return Promise.reject("App is not init!");

    this._app.start();
    this._app.ticker.add(this.update, this);
    this.resize();

    window.addEventListener("resize", this.resize);

    if (this.gameInstanceProvider.animatemap.firstEntrance === "false") {
      return await this._play();
    } else {
      this.getConfig().firstEntrance = true;
      return (
        new TimeoutCommand(1000)
          .execute()
          // .then(() => {
          //   return new WaitClickForHeroCreation().execute();
          // })
          .then(async (command: WaitClickForHeroCreation) => {
            await this._play(command.clickPoint);
            this.gameInstanceProvider.handleSetAnimateMapFirstEntrance("false");
          })
      );
    }
  }

  private async _play(position: Point = StartPoint()): Promise<void> {
    // this.fillPlayerData(position).catch((error) => console.log(error));
    await this._mapContainer?.start();
  }

  private resize() {
    if (this._renderer) {
      if (this._mapContainer) {
        this._mapContainer.resize(
          this._app?.renderer?.width ?? 0,
          this._app?.renderer?.height ?? 0
        );
      }
    }
  }

  private update(dt: number) {
    const position = this._mapContainer?.entityFactory?.getPlayerNode()
      ?.position;
    if (position) this.dataProvider.setPlayerPosition(position.x, position.y);
    this.dataProvider.update(dt / settings.TARGET_FPMS);
    this._mapContainer?.update(dt);
    if (Date.now() % 200 === 0) {
      //TODO: can find better decision? Possibly resize on rerender?
      this._app?.resize();
      this.resize();
    }
  }

  /**
   * Release methods
   */
  public async release(): Promise<void> {
    await this.releaseMap();
    await this.releaseRenderer();
  }

  private async releaseRenderer(): Promise<void> {
    if (this._app) {
      this._app.ticker.remove(this.update, this);
      this._app.destroy(false);
    }
  }

  private async releaseMap(): Promise<void> {
    if (this._mapContainer) {
      this._stage?.removeChild(this._mapContainer);

      await this._mapContainer.release();
    }
  }

  public getConfig(): GameConfig {
    return this.gameInstanceProvider.config;
  }

  public getMapContainer() {
    return this._mapContainer;
  }

  public getRenderer() {
    return this._renderer;
  }

  private _unsubscribeSetEnvironmentSound!: () => void;

  private _subscribes() {
    //TODO: refactor all subscribes to separate class? An example, rework eventProvider for this.

    EventProvider.on(EventType.USER_JOINED, (user: ReplicatedUser) => {
      console.log(`- ${user} join to room`);
      this._mapContainer?.entityFactory?.updateUserPositionById(user);
    });

    EventProvider.on(EventType.USER_LEFT, (user: ReplicatedUser) => {
      console.log(`- ${user} left from room`);
      this._mapContainer?.entityFactory?.removeUserById(user.toString());
    });

    EventProvider.on(EventType.USER_MOVED, (user: ReplicatedUser) => {
      console.log("user", user);
      this._mapContainer?.entityFactory?.updateUserPositionById(user);
    });

    // Venues
    this.dataProvider.on(
      DataProviderEvent.VENUE_ADDED,
      (venue: ReplicatedVenue) => {
        console.log("venue", venue);
        this._mapContainer?.entityFactory?.createVenue(venue);
      }
    );

    this.dataProvider.on(
      DataProviderEvent.VENUE_REMOVED,
      (venue: ReplicatedVenue) => {
        console.log("venue", venue);
        this._mapContainer?.entityFactory?.removeVenue(venue);
      }
    );

    this.dataProvider.on(
      DataProviderEvent.VENUE_UPDATED,
      (venue: ReplicatedVenue) => {
        console.log("venue", venue);
        this._mapContainer?.entityFactory?.updateVenue(venue);
      }
    );

    // Firebarrels
    this.dataProvider.on(
      DataProviderEvent.FIREBARREL_ADDED,
      (firebarrel: ReplicatedFirebarrel) => {
        console.log("firebarell", firebarrel);
        this._mapContainer?.entityFactory?.createFireBarrel(firebarrel);
      }
    );

    this.dataProvider.on(
      DataProviderEvent.FIREBARREL_REMOVED,
      (firebarrel: ReplicatedFirebarrel) => {
        console.log("firebarell", firebarrel);
        this._mapContainer?.entityFactory?.removeBarrel(firebarrel);
      }
    );

    this.dataProvider.on(
      DataProviderEvent.FIREBARREL_UPDATED,
      (firebarrel: ReplicatedFirebarrel) => {
        console.log("firebarell", firebarrel);
        this._mapContainer?.entityFactory?.updateBarrel(firebarrel);
      }
    );

    window.addEventListener("resize", this.resize.bind(this));

    this.eventProvider.on(EventType.UI_SINGLE_BUTTON_FOLLOW, () =>
      this._mapContainer?.entityFactory?.setPlayerCameraFollow(true)
    );

    this._unsubscribeSetEnvironmentSound = subscribeActionAfter(
      AnimateMapActionTypes.SET_ENVIRONMENT_SOUND,
      (action) => {
        console.log("environment sound is ");
        console.log(
          (action as setAnimateMapEnvironmentSoundAction).payload
            .environmentSound
        );
      }
    );
  }

  private _unsubscribes() {
    //TODO: remove all listeners from this._subscribes()

    this._unsubscribeSetEnvironmentSound();
  }
}
