import { Engine, NodeList, System } from "@ash.ts/ash";
import { Howler } from "howler";
import { throttle } from "lodash";
import { Application, InteractionEvent, Point } from "pixi.js";
import { MovedEventData, Viewport, ZoomedEventData } from "pixi-viewport";
import { subscribeActionAfter } from "redux-subscribe-action";

import {
  AnimateMapActionTypes,
  setAnimateMapEnvironmentSoundAction,
  setAnimateMapZoom,
  setAnimateMapZoomAction,
} from "store/actions/AnimateMap";

import { EventType } from "components/templates/AnimateMap/bridges/EventProvider/EventProvider";

import { TimeoutCommand } from "../../commands/TimeoutCommand";
import { GameInstance } from "../../GameInstance";
import { easeInOutQuad, Easing } from "../../utils/Easing";
import { ViewportComponent } from "../components/ViewportComponent";
import { ViewportFollowComponent } from "../components/ViewportFollowComponent";
import EntityFactory from "../entities/EntityFactory";
import { ViewportFollowNode } from "../nodes/ViewportFollowNode";
import { ViewportNode } from "../nodes/ViewportNode";

export class ViewportSystem extends System {
  private player: NodeList<ViewportFollowNode> | null = null;

  private easing: Easing | null = null;
  private viewportList: NodeList<ViewportNode> | null = null;

  private _unsubscribeSetZoom!: () => void;
  private _unsubscribeSetEnvironmentSound!: () => void;

  private _setAnimateMapZoomThrottle!: (value: number) => void;

  constructor(
    private _app: Application,
    private _viewport: Viewport,
    private _entityCreator: EntityFactory
  ) {
    super();
  }

  addToEngine(engine: Engine): void {
    this.viewportList = engine.getNodeList(ViewportNode);
    this._entityCreator.createViewport(new ViewportComponent());

    const config = GameInstance.instance.getConfig();
    const worldWidth = config.worldWidth;
    const worldHeight = config.worldHeight;

    this._viewport.worldWidth = worldWidth;
    this._viewport.worldHeight = worldHeight;
    this._viewport.interactive = this._app?.renderer.plugins.interaction;

    this._viewport
      .drag({ factor: 0.9 })
      .pinch()
      .wheel({ percent: 0.5, smooth: 10 })
      // .decelerate()
      .clamp({
        left: true,
        right: true,
        top: true,
        bottom: true,
      })
      .clampZoom({
        maxWidth: worldWidth * 0.48,
        maxHeight: worldHeight * 0.48,
        minWidth: worldWidth / 64,
        minHeight: worldHeight / 64,
      });

    // TODO move to player coords
    this._viewport.moveCenter(worldWidth / 2, worldHeight / 2);

    this._viewport.on("moved", this._viewportMovedHandler, this);
    this._viewport.on("zoomed", this._viewportZoomedHandler, this);
    this._viewport.on("zoomed-end", this._viewportZoomedEndHandler, this);

    this._viewport.on("clicked", this._viewportClickedHandler, this);
    this._viewport.on("drag-start", this._viewportDragStartHandler, this);

    this._unsubscribeSetZoom = subscribeActionAfter(
      AnimateMapActionTypes.SET_ZOOM,
      (action) =>
        this.handleSetZoom((action as setAnimateMapZoomAction).payload.zoom)
    );

    this._unsubscribeSetEnvironmentSound = subscribeActionAfter(
      AnimateMapActionTypes.SET_ENVIRONMENT_SOUND,
      (action) => {
        Howler.mute(
          !(action as setAnimateMapEnvironmentSoundAction).payload
            .environmentSound
        );
      }
    );

    GameInstance.instance.eventProvider.on(
      EventType.UI_CONTROL_PANEL_ZOOM_OUT,
      // this.handleZoomOut
      () =>
        GameInstance.instance._mapContainer?._entityContainer?.emit(
          "wheel",
          new WheelEvent("short", {
            deltaX: 0.0,
            deltaY: -100,
            deltaZ: 0.0,
            deltaMode: 0,
          })
        )
    );

    this._viewport.on("wheel", (e) => console.log(e));

    GameInstance.instance.eventProvider.on(
      EventType.UI_CONTROL_PANEL_ZOOM_IN,
      // this.handleZoomIn
      () =>
        GameInstance.instance._mapContainer?._entityContainer?.emit(
          "wheel",
          new WheelEvent("short", {
            deltaX: 0.0,
            deltaY: 100,
            deltaZ: 0.0,
            deltaMode: 0,
          })
        )
    );

    this._setAnimateMapZoomThrottle = throttle((value: number) => {
      GameInstance.instance.getStore().dispatch(setAnimateMapZoom(value));
    }, GameInstance.DEBOUNCE_TIME);

    Howler.mute(!GameInstance.instance.getState().environmentSound);

    this.player = engine.getNodeList(ViewportFollowNode);
    this.player.nodeAdded.add(this.handlePlayerAdded);
    this.player.nodeRemoved.add(this.handlePlayerRemoved);

    if (this.player.head) {
      this.initViewportFollowing(this.player.head);
    }

    const zoomLevel = GameInstance.instance.getState().zoom;
    const zoomViewport = GameInstance.instance
      .getConfig()
      .zoomLevelToViewport(zoomLevel);
    this._viewport.setZoom(zoomViewport);

    this.viewportList.head!.viewport.zoomLevel = zoomLevel;
    this.viewportList.head!.viewport.zoomViewport = this._viewport.scale.y;

    this._entityCreator.updateViewport();
  }

  removeFromEngine(engine: Engine): void {
    this.viewportList = null;

    this._viewport.off("moved", this._viewportMovedHandler, this);
    this._viewport.off("zoomed", this._viewportZoomedHandler, this);
    this._viewport.off("snap-zoom-end", this._viewportZoomedEndHandler, this);
    this._viewport.off("clicked", this._viewportClickedHandler, this);
    this._viewport.off("drag-start", this._viewportDragStartHandler, this);

    this._unsubscribeSetZoom();
    this._unsubscribeSetEnvironmentSound();

    GameInstance.instance.eventProvider.off(
      EventType.UI_CONTROL_PANEL_ZOOM_OUT,
      this.handleZoomOut
    );
    GameInstance.instance.eventProvider.off(
      EventType.UI_CONTROL_PANEL_ZOOM_IN,
      this.handleZoomIn
    );
  }

  update(time: number): void {
    if (this.easing) {
      this.easing.update(time);
    }

    if (
      this.viewportList &&
      this.viewportList.head &&
      this.viewportList.head.viewport.click
    ) {
      this.viewportList.head.viewport.click = null;
    }
    this._viewport.update(time);

    if (this.player && this.player.head && this.viewportList?.head?.viewport) {
      const x = this.player.head.position.x;
      const y = this.player.head.position.y;
      const z = 1 - this.viewportList?.head?.viewport.zoomViewport;

      Howler.pos(x, y, z);
    }
  }

  private handlePlayerAdded = (node: ViewportFollowNode): void => {
    if (node.sprite.view) {
      this.initViewportFollowing(node);
    } else {
      new TimeoutCommand(100).execute().then(() => {
        if (this.player && this.player.head) {
          this.initViewportFollowing(this.player.head);
        }
      });
    }
  };

  private handlePlayerRemoved = (node: ViewportFollowNode): void => {
    this.stopViewportFollowing();
  };

  private initViewportFollowing = (player: ViewportFollowNode): void => {
    if (player.sprite.view) {
      this._viewport.plugins.remove("follow");
      this._viewport.follow(player.sprite.view);
    }
  };

  private stopViewportFollowing = (): void => {
    this._viewport.plugins.remove("follow");

    if (this.player) {
      while (this.player.head) {
        this.player.head.entity.remove(ViewportFollowComponent);
      }
    }
  };

  private _viewportMovedHandler(data: MovedEventData): void {}

  private _viewportZoomedHandler(data: ZoomedEventData): void {
    if (this.viewportList && this.viewportList.head) {
      this.viewportList.head.viewport.zoomLevel = GameInstance.instance
        .getConfig()
        .zoomViewportToLevel(data.viewport.scale.y);
      this.viewportList.head.viewport.zoomViewport = data.viewport.scale.y;
      this._entityCreator.updateViewport();
    }
  }

  private handleZoomOut = (): void => {};

  private handleZoomIn = (): void => {};

  private handleSetZoom(zoomLevel: number): void {
    const viewWidth = this._viewport?.width;
    const viewHeight = this._viewport?.height;
    if (!(viewWidth && viewHeight)) return;
    if (!this.viewportList || !this.viewportList.head) {
      return;
    }

    const currenZoomLevel = this.viewportList.head.viewport.zoomLevel;
    if (zoomLevel === currenZoomLevel) {
      return;
    }

    this.easeZoom(
      GameInstance.instance.getConfig().zoomLevelToViewport(zoomLevel)
    );
  }

  private easeZoom(viewportZoom: number): void {
    const startValue = this._viewport.scale.y;
    const endValue = viewportZoom;

    this.easing = new Easing(startValue, endValue, 600, easeInOutQuad);

    this.easing.onComplete = () => {
      this.easing = null;
      if (this.viewportList && this.viewportList.head) {
        this.viewportList.head.viewport.zoomLevel = GameInstance.instance
          .getConfig()
          .zoomViewportToLevel(endValue);
        this.viewportList.head.viewport.zoomViewport = endValue;
        this._entityCreator.updateViewport();
      }

      this._viewportZoomedEndHandler(this._viewport);
    };

    this.easing.onStep = (value: number) => {
      this._viewport.setZoom(value, true);
      if (this.viewportList && this.viewportList.head) {
        this.viewportList.head.viewport.zoomLevel = GameInstance.instance
          .getConfig()
          .zoomViewportToLevel(value);
        this.viewportList.head.viewport.zoomViewport = endValue;
        this._entityCreator.updateViewport();
      }
    };
  }

  private _viewportZoomedEndHandler(viewport: Viewport): void {
    if (this.viewportList && this.viewportList.head) {
      this.viewportList.head.viewport.zoomViewport = viewport.scale.y;
      this.viewportList.head.viewport.zoomLevel = GameInstance.instance
        .getConfig()
        .zoomViewportToLevel(this.viewportList.head.viewport.zoomViewport);
      this._entityCreator.updateViewport();

      this._setAnimateMapZoomThrottle(
        this.viewportList.head.viewport.zoomLevel
      );
    }
  }

  private _viewportDragStartHandler(e: { world: Point }): void {
    this.stopViewportFollowing();
  }

  private _viewportClickedHandler(e: { world: Point }): void {
    this.viewportList!.head!.viewport.click = e.world;
    this._entityCreator.updateViewport();
  }

  private _viewportPointerUpHandler(e: InteractionEvent): void {
    this.viewportList!.head!.viewport.click = e.data.getLocalPosition(
      this._viewport,
      e.data.global,
      e.data.global
    );
    this._entityCreator.updateViewport();
  }
}
