import {
  Application,
  Container,
  Loader,
  LoaderResource,
  Renderer,
} from "pixi.js";
import { Store } from "redux";
import { subscribeActionAfter } from "redux-subscribe-action";

import {
  AnimateMapActionTypes,
  setAnimateMapEnvironmentSoundAction,
  setAnimateMapUsers,
} from "store/actions/AnimateMap";
import { AnimateMapState, ReplicatedVenue } from "store/reducers/AnimateMap";

import { Point } from "types/utility";

import { DataProvider } from "../bridges/DataProvider";
import { DataProviderEvent } from "../bridges/DataProvider/Providers/DataProviderEvent";
import EventProvider, {
  EventType,
} from "../bridges/EventProvider/EventProvider";
import { GameConfig } from "../configs/GameConfig";

import { TimeoutCommand } from "./commands/TimeoutCommand";
import WaitClickForHeroCreation from "./commands/WaitClickForHeroCreation";
import { assets } from "./constants/AssetConstants";
import { stubUsersData } from "./constants/StubData";
import { MapContainer } from "./map/MapContainer";
import { StartPoint } from "./utils/Point";

export class GameInstance {
  public static DEBOUNCE_TIME: number = 25;

  public static instance: GameInstance;

  private _app?: Application;
  private _renderer?: Renderer;

  private _stage?: Container;
  public _mapContainer?: MapContainer;
  private _eventProvider = EventProvider;
  get eventProvider() {
    return this._eventProvider;
  }

  constructor(
    private _config: GameConfig,
    private _store: Store,
    public dataProvider: DataProvider,
    private _containerElement: HTMLDivElement,
    private _pictureUrl?: string
  ) {
    if (GameInstance.instance) console.error("Multiply instancing!");
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
      resizeTo: this._containerElement,
      backgroundColor: 0xe7d4c3,
      resolution: 1,
    });

    this._renderer = this._app.renderer;
    this._stage = this._app.stage;

    this._containerElement.appendChild(this._app.view);
  }

  private async initMap(): Promise<void> {
    if (!this._app) return console.error();
    this._store.dispatch(setAnimateMapUsers(stubUsersData()));

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

  private async fillPlayerData(point: Point) {
    return this.dataProvider.initPlayerPositionAsync(point.x, point.y);
  }

  public async start(): Promise<void> {
    if (!this._app) return Promise.reject("App is not init!");

    this._app.start();
    this._app.ticker.add(this.update, this);
    this.resize();

    window.addEventListener("resize", this.resize);

    if (this.getState().firstEntrance === "false") {
      return await this._play();
    } else {
      return new TimeoutCommand(1000)
        .execute()
        .then(() => {
          return new WaitClickForHeroCreation().execute();
        })
        .then(async (command: WaitClickForHeroCreation) => {
          await this._play(command.clickPoint);
          window.sessionStorage.setItem(
            "AnimateMapState.sessionStorage",
            "false"
          ); //TODO: add complex save system with types support
        });
    }
  }

  private async _play(position: Point = StartPoint()): Promise<void> {
    this.fillPlayerData(position).catch((error) => console.log(error));
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
    this.dataProvider.update(dt);
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

  public getStore(): Store {
    return this._store;
  }

  public getState(): AnimateMapState {
    return this._store.getState().animatemap;
  }

  public getConfig(): GameConfig {
    return this._config;
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

    EventProvider.on(EventType.USER_JOINED, (userId: number) => {
      console.log(`- ${userId} join to room`);
    });

    EventProvider.on(EventType.USER_LEFT, (userId: number) => {
      console.log(`- ${userId} left from room`);
      this._mapContainer?.entityFactory?.removeUserById(userId.toString());
    });

    EventProvider.on(
      EventType.USER_MOVED,
      (userId: number, x: number, y: number) => {
        this._mapContainer?.entityFactory?.updateUserPositionById(
          userId.toString(),
          x,
          y
        );
      }
    );

    this.dataProvider.on(
      DataProviderEvent.VENUE_ADDED,
      (venue: ReplicatedVenue) => {
        this._mapContainer?.entityFactory?.createVenue(venue);
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
