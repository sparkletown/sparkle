import { Engine, NodeList, System } from "@ash.ts/ash";
import { Container, DisplayObject, Graphics, Sprite } from "pixi.js";
import { Viewport } from "pixi-viewport";

import { Point } from "types/utility";

import { RoomPointNode } from "../../../bridges/DataProvider/Structures/RoomsModel";
import { EventType } from "../../../bridges/EventProvider/EventProvider";
import { GameInstance } from "../../GameInstance";
import EntityFactory from "../entities/EntityFactory";
import { BotNode } from "../nodes/BotNode";
import { PlayerNode } from "../nodes/PlayerNode";
import { VenueNode } from "../nodes/VenueNode";
import { ViewportNode } from "../nodes/ViewportNode";

export class DebugSystem extends System {
  private container: Container;

  private venues?: NodeList<VenueNode>;
  private bots?: NodeList<BotNode>;
  private viewportNodes?: NodeList<ViewportNode>;
  private player?: NodeList<PlayerNode>;

  private zoomUpdated = true;
  private currentZoom = 0;

  constructor(
    container: Container,
    private creator: EntityFactory,
    private viewport: Viewport
  ) {
    super();
    this.container = container;
  }

  addToEngine(engine: Engine) {
    this.viewportNodes = engine.getNodeList(ViewportNode);
    this.viewportNodes.nodeAdded.add(this.handleViewprotAdded);
    if (this.viewportNodes.head) {
      this.currentZoom = this.viewportNodes.head.viewport.zoomLevel;
    }

    this.bots = engine.getNodeList(BotNode);

    this.player = engine.getNodeList(PlayerNode);

    // this.drawVenuesOuterCircle();
    // this.drawPlayaBorderCircle();
    // this.drawVenuesInnerCircle();

    this.venues = engine.getNodeList(VenueNode);
    this.venues.nodeAdded.add(this.venueAdded);
    this.venues.nodeRemoved.add(this.venueRemoved);

    GameInstance.instance.eventProvider.on(
      EventType.ON_ROOMS_CHANGED,
      this.handleRooms
    );
  }

  removeFromEngine(engine: Engine) {
    this.container?.removeChildren();

    this.venues?.nodeAdded.remove(this.venueAdded);
    this.venues?.nodeRemoved.remove(this.venueRemoved);
    this.venues = undefined;

    this.viewportNodes?.nodeAdded.remove(this.handleViewprotAdded);
    this.viewportNodes = undefined;

    this.bots = undefined;
    this.player = undefined;

    GameInstance.instance.eventProvider.off(
      EventType.ON_ROOMS_CHANGED,
      this.handleRooms
    );
  }

  update(time: number) {
    this.updateLineOfSight(time);

    const showDebug = false;
    if (showDebug) {
      this.updateBubbling();
      this.drawVenuesInnerCircle();
      this.drawVenuesOuterCircle();
      this.drawPlayaBorderCircle();
    }
  }

  private handleRooms = (points: RoomPointNode[]) => {
    const name = "roomPoint";
    if (this.container) {
      this.container.children.forEach((display) => {
        if (display.name.indexOf(name) > -1 && display.parent) {
          display.parent.removeChild(display);
        }
      });

      const set: Set<string> = new Set();
      points.forEach((item) => item.data.forEach((rect) => set.add(rect)));
      console.log(set);
      let count = 0;
      set.forEach((rect) => {
        const rectPoints = points.filter((items) => items.data.includes(rect));

        let min = { x: rectPoints[0].x, y: rectPoints[0].y };
        let max = { x: rectPoints[0].x, y: rectPoints[0].y };

        rectPoints.forEach((point) => {
          if (point.x < min.x && point.y < min.y) min = point;
          if (point.x > max.x && point.y > max.y) max = point;
        });

        const g: Graphics = new Graphics();
        g.name = `${name}${++count}`;
        g.lineStyle(4, 0x6108e6);
        g.drawRect(0, 0, max.x - min.x, max.y - min.y);
        g.position.set(min.x, min.y);
        this.container?.addChild(g);
      });
    }
  };

  private halo = {
    duration: 100,
    time: 0,
    direction: 1,
    getValue: (x: number) => {
      return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
    },
  };

  private updateLineOfSight(time: number) {
    const name = "visionOfSightRadius";
    const config = GameInstance.instance.getConfig();
    const currentZoomLevel = config.zoomViewportToLevel(this.viewport.scale.y);
    if (this.player && this.player.head) {
      const center: Point = this.player?.head
        ? { x: this.player.head.position.x, y: this.player.head.position.y }
        : this.viewport.center;
      const lineOfSight = config.getAvatarLineOfSightByZoomLevel(1);
      const visionOfSightRadius =
        this.player.head.position.scaleX * lineOfSight;

      let s = this.container?.getChildByName(name) as Sprite;
      if (!s) {
        s = new Sprite();
        s.name = name;

        const g: Graphics = new Graphics();
        g.alpha = 0.2;
        s.addChild(g);
        this.container?.addChild(s);
      }
      s.position.set(center.x, center.y);

      const lineThikness =
        currentZoomLevel === config.ZOOM_LEVEL_WALKING ? 2 : 4;

      const dayTime = Math.floor(
        GameInstance.instance.getConfig().getCurUTCTime() % 24
      );
      const backgroundColor = dayTime > 5 && dayTime < 18 ? 0x5e07ca : 0xffffff;
      const borderColor = dayTime > 5 && dayTime < 18 ? 0x6108e6 : 0xffffff;

      const g: Graphics = s.getChildAt(0) as Graphics;
      g.clear();
      g.beginFill(backgroundColor, 0.15);
      g.drawCircle(0, 0, visionOfSightRadius);
      g.endFill();
      g.lineStyle(lineThikness, borderColor);
      g.drawCircle(0, 0, visionOfSightRadius);

      this.halo.time +=
        time * (this.halo.direction === 1 ? 1 : 0.7) * this.halo.direction;
      if (this.halo.time <= 0) {
        this.halo.time = 0;
        this.halo.direction = 1;
      } else if (this.halo.time >= this.halo.duration) {
        this.halo.time = this.halo.duration;
        this.halo.direction = -1;
      }
      const value = this.halo.getValue(this.halo.time / this.halo.duration) / 3;

      s.scale.set(1 + value);
    } else {
      const s: Sprite | undefined = this.container?.getChildByName(
        name
      ) as Sprite;
      if (s) {
        this.container?.removeChild(s);
      }
    }
  }

  private updateBubbling() {
    if (Math.random() > 0.05) {
      return;
    }

    for (
      let node: BotNode | null | undefined = this.bots?.head;
      node;
      node = node?.next
    ) {
      if (Math.random() < 0.01) {
        this.creator.createBubble(node.bot.data.data.id, "Hello from debug!!!");
        return;
      }
    }
  }

  private handleViewprotAdded = (node: ViewportNode) => {
    if (node.viewport.zoomLevel !== this.currentZoom) {
      this.zoomUpdated = true;
    }
  };

  private drawVenuesInnerCircle() {
    const config = GameInstance.instance.getConfig();
    const center: Point = config.worldCenter;
    const radius = config.worldWidth * 0.073;

    const g: Graphics = new Graphics();
    g.beginFill(0x00ff00);
    g.drawCircle(center.x, center.y, radius);
    g.endFill();
    g.alpha = 0.1;
    this.container?.addChild(g);
  }

  private drawVenuesOuterCircle() {
    const config = GameInstance.instance.getConfig();
    const center: Point = config.worldCenter;
    const radius = config.worldWidth * 0.1713;

    const g: Graphics = new Graphics();
    g.beginFill(0x00ff00);
    g.drawCircle(center.x, center.y, radius);
    g.endFill();
    g.alpha = 0.1;
    this.container?.addChild(g);
  }

  private drawPlayaBorderCircle() {
    const config = GameInstance.instance.getConfig();
    const center: Point = config.worldCenter;
    const radius = config.worldWidth * 0.4;

    const g: Graphics = new Graphics();
    g.beginFill(0x00ff00);
    g.drawCircle(center.x, center.y, radius);
    g.endFill();
    g.alpha = 0.1;
    this.container?.addChild(g);
  }

  private venueAdded = (node: VenueNode) => {
    const g: Graphics = new Graphics();
    g.position.set(node.position.x, node.position.y);
    g.name = node.venue.model.data.url;
    g.beginFill(0x0000ff);
    g.drawCircle(0, 0, node.collision.radius);
    g.endFill();
    g.alpha = 0.1;
    // this.container?.addChild(g);
  };

  private venueRemoved = (node: VenueNode) => {
    const displayObject:
      | DisplayObject
      | null
      | undefined = this.container?.getChildByName(node.venue.model.data.url);
    if (displayObject) {
      this.container?.removeChild();
    }
  };
}
