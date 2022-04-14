import { Engine, NodeList, System } from "@ash.ts/ash";
import { Howler } from "howler";
import { throttle } from "lodash";
import { Application, InteractionEvent, Point } from "pixi.js";
import { MovedEventData, Viewport, ZoomedEventData } from "pixi-viewport";
import { subscribeActionAfter } from "redux-subscribe-action";

import {
  AnimateMapActionTypes,
  setAnimateMapEnvironmentSoundAction,
  setAnimateMapLastZoom,
  setAnimateMapZoom,
  setAnimateMapZoomAction,
} from "store/actions/AnimateMap";

import { EventType } from "components/templates/AnimateMap/bridges/EventProvider/EventProvider";

import { TimeoutCommand } from "../../commands/TimeoutCommand";
import { GameControls } from "../../common";
import { GameInstance } from "../../GameInstance";
import { easeInOutQuad, Easing } from "../../utils/Easing";
import { ViewportComponent } from "../components/ViewportComponent";
import { ViewportFollowComponent } from "../components/ViewportFollowComponent";
import EntityFactory from "../entities/EntityFactory";
import { ViewportFollowNode } from "../nodes/ViewportFollowNode";
import { ViewportNode } from "../nodes/ViewportNode";

export class ViewportSystem extends System {
  private player?: NodeList<ViewportFollowNode>;

  private easing?: Easing;
  private viewportList?: NodeList<ViewportNode>;

  private _unsubscribeSetZoom!: () => void;
  private _unsubscribeSetEnvironmentSound!: () => void;

  private _setAnimateMapZoomThrottle!: (value: number) => void;

  private firstPlayerAdding = true;

  constructor(
    private _controls: GameControls,
    private _app: Application,
    private _viewport: Viewport,
    private _entityCreator: EntityFactory
  ) {
    super();
  }

  addToEngine(engine: Engine) {
    this.viewportList = engine.getNodeList(ViewportNode);
    this._entityCreator.createViewport(new ViewportComponent());

    const config = this._controls.getConfig();
    const worldWidth = config.worldWidth;
    const worldHeight = config.worldHeight;

    this._viewport.worldWidth = worldWidth;
    this._viewport.worldHeight = worldHeight;
    this._viewport.interactive = true; //this._app?.renderer.plugins.interaction;

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
        maxWidth: worldWidth * 0.68,
        maxHeight: worldHeight * 0.68,
        minWidth: worldWidth * 0.024,
        minHeight: worldHeight * 0.024,
      });

    this._viewport.on("moved", this._viewportMovedHandler, this);
    this._viewport.on("zoomed", this._viewportZoomedHandler, this);
    this._viewport.on("zoomed-end", this._viewportZoomedEndHandler, this);

    this._viewport.on("clicked", this._viewportClickedHandler, this);
    this._viewport.on("drag-start", this._viewportDragStartHandler, this);

    this._unsubscribeSetZoom = subscribeActionAfter(
      AnimateMapActionTypes.SET_ZOOM_LEVEL,
      (action) =>
        this.handleSetZoom(
          (action as setAnimateMapZoomAction).payload.zoomLevel
        )
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
      () => {
        const wheel: WheelEvent = new WheelEvent("wheel", { deltaY: 90 });
        try {
          this._viewport.plugins.get("wheel").wheel(wheel);
        } catch (error) {
          console.error(error);
        }
      }
    );

    GameInstance.instance.eventProvider.on(
      EventType.UI_CONTROL_PANEL_ZOOM_IN,
      () => {
        const wheel: WheelEvent = new WheelEvent("wheel", { deltaY: -90 });
        try {
          this._viewport.plugins.get("wheel").wheel(wheel);
        } catch (error) {
          console.error(error);
        }
      }
    );

    this._setAnimateMapZoomThrottle = throttle((value: number) => {
      this._controls.dispatch(setAnimateMapZoom(value));
    }, GameInstance.DEBOUNCE_TIME);

    Howler.mute(!this._controls.getEnvironmentSound());

    this.player = engine.getNodeList(ViewportFollowNode);
    this.player.nodeAdded.add(this.handlePlayerAdded);
    this.player.nodeRemoved.add(this.handlePlayerRemoved);

    const zoomLevel = this._controls.getZoomLevel();
    const zoomViewport = this._controls
      .getConfig()
      .zoomLevelToViewport(zoomLevel);
    this._viewport.setZoom(zoomViewport);

    if (!this.viewportList?.head) return console.error(); //todo: refactor
    this.viewportList.head.viewport.zoomLevel = zoomLevel;
    this.viewportList.head.viewport.zoomViewport = this._viewport.scale.y;
    this._entityCreator.updateViewport();

    this._viewport.update(1);

    if (this.player && this.player.head) {
      this.initViewportFollowing(this.player.head);
    } else {
      this._viewport.moveCenter(worldWidth / 2, worldHeight / 2);
    }
  }

  removeFromEngine(engine: Engine) {
    this.viewportList = undefined;

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

  update(time: number) {
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

      if (isFinite(x) && isFinite(y) && isFinite(z)) Howler.pos(x, y, z);
    }
  }

  private handlePlayerAdded = (node: ViewportFollowNode) => {
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

  private handlePlayerRemoved = (node: ViewportFollowNode) => {
    this.stopViewportFollowing();
  };

  private initViewportFollowing = (player: ViewportFollowNode) => {
    if (this.firstPlayerAdding) {
      this.firstPlayerAdding = false;

      let zoom: number;
      if (this._controls.getConfig().firstEntrance) {
        zoom = this._controls
          .getConfig()
          .zoomLevelToViewport(this._controls.getConfig().ZOOM_LEVEL_WALKING);
      } else {
        zoom = this._controls.getLastZoom();
        if (zoom < 0.1) {
          zoom = 0.1;
        }
      }

      new TimeoutCommand(200).execute().then(() => {
        this._viewport.animate({
          position: new Point(player.position.x, player.position.y),
          scale: zoom,
          time: 100,
          ease: "easeInOutQuad",
          callbackOnComplete: () => {
            if (player && player.sprite && player.sprite.view) {
              this._viewport.plugins.remove("follow");
              this._viewport.follow(player.sprite.view);
            }
          },
        });
      });
    } else {
      this._viewport.animate({
        position: new Point(player.position.x, player.position.y),
        time: 100,
        ease: "easeInOutQuad",
        callbackOnComplete: () => {
          if (player && player.sprite && player.sprite.view) {
            this._viewport.plugins.remove("follow");
            this._viewport.follow(player.sprite.view);
          }
        },
      });
    }
  };

  private stopViewportFollowing = () => {
    this._viewport.plugins.remove("follow");

    if (this.player) {
      while (this.player.head) {
        this.player.head.entity.remove(ViewportFollowComponent);
      }
    }
  };

  private _viewportMovedHandler(data: MovedEventData) {}

  private _viewportZoomedHandler(data: ZoomedEventData) {
    if (this.viewportList && this.viewportList.head) {
      this.viewportList.head.viewport.zoomLevel = this._controls
        .getConfig()
        .zoomViewportToLevel(data.viewport.scale.y);
      this.viewportList.head.viewport.zoomViewport = data.viewport.scale.y;
      this._entityCreator.updateViewport();
    }
  }

  private handleZoomOut = () => {};

  private handleZoomIn = () => {};

  private handleSetZoom(zoomLevel: number) {
    const viewWidth = this._viewport?.width;
    const viewHeight = this._viewport?.height;
    if (!(viewWidth && viewHeight)) return;
    if (!this.viewportList || !this.viewportList.head) {
      return;
    }

    if (zoomLevel === this.viewportList.head.viewport.zoomLevel) {
      return;
    }

    this.easeZoom(this._controls.getConfig().zoomLevelToViewport(zoomLevel));
  }

  private easeZoom(viewportZoom: number) {
    const startValue = this._viewport.scale.y;
    const endValue = viewportZoom;

    this.easing = new Easing(startValue, endValue, 600, easeInOutQuad);

    this.easing.onComplete = () => {
      this.easing = undefined;
      if (this.viewportList && this.viewportList.head) {
        this.viewportList.head.viewport.zoomLevel = this._controls
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
        this.viewportList.head.viewport.zoomLevel = this._controls
          .getConfig()
          .zoomViewportToLevel(value);
        this.viewportList.head.viewport.zoomViewport = endValue;
        this._entityCreator.updateViewport();
      }
    };
  }

  private _viewportZoomedEndHandler(viewport: Viewport) {
    if (this.viewportList && this.viewportList.head) {
      this.viewportList.head.viewport.zoomViewport = viewport.scale.y;
      this.viewportList.head.viewport.zoomLevel = this._controls
        .getConfig()
        .zoomViewportToLevel(this.viewportList.head.viewport.zoomViewport);
      this._entityCreator.updateViewport();

      this._setAnimateMapZoomThrottle(
        this.viewportList.head.viewport.zoomLevel
      );
    }

    this._controls.dispatch(setAnimateMapLastZoom(viewport.scale.y));
  }

  private _viewportDragStartHandler(e: { world: Point }) {
    this.stopViewportFollowing();
  }

  private _viewportClickedHandler(e: { world: Point }) {
    if (!this.viewportList?.head) return console.error();
    this.viewportList.head.viewport.click = e.world;
    this._entityCreator.updateViewport();
  }

  private _viewportPointerUpHandler(e: InteractionEvent) {
    if (!this.viewportList?.head) return console.error();
    this.viewportList.head.viewport.click = e.data.getLocalPosition(
      this._viewport,
      e.data.global,
      e.data.global
    );
    this._entityCreator.updateViewport();
  }
}
