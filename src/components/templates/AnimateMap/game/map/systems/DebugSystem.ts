import { Engine, NodeList, System } from "@ash.ts/ash";
import { GameConfig } from "components/templates/AnimateMap/configs/GameConfig";
import { Viewport } from "pixi-viewport";
import { Container, DisplayObject, Graphics, Sprite } from "pixi.js";
import { Point } from "types/utility";
import { GameInstance } from "../../GameInstance";
import EntityFactory from "../entities/EntityFactory";
import { BotNode } from "../nodes/BotNode";
import { PlayerNode } from "../nodes/PlayerNode";
import { VenueNode } from "../nodes/VenueNode";
import { ViewportNode } from "../nodes/ViewportNode";

export class DebugSystem extends System {
  private container: Container | null = null;

  private venues: NodeList<VenueNode> | null = null;
  private bots: NodeList<BotNode> | null = null;
  private viewportNodes: NodeList<ViewportNode> | null = null;
  private player: NodeList<PlayerNode> | null = null;

  private zoomUpdated = true;
  private currentZoom = 0;

  private deltaScale = 0.2;

  constructor(
    container: Container,
    private creator: EntityFactory,
    private viewport: Viewport
  ) {
    super();
    this.container = container;
  }

  addToEngine(engine: Engine): void {
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
  }

  removeFromEngine(engine: Engine): void {
    this.container?.removeChildren();

    this.venues!.nodeAdded.remove(this.venueAdded);
    this.venues!.nodeRemoved.remove(this.venueRemoved);
    this.venues = null;

    this.viewportNodes!.nodeAdded.remove(this.handleViewprotAdded);
    this.viewportNodes = null;

    this.bots = null;
    this.player = null;
  }

  update(time: number): void {
    // this.updateBubbling();
    this.updateLineOfSight();
  }

  private updateLineOfSight(): void {
    const name = "visionOfSightRadius";
    const config: GameConfig = GameInstance.instance.getConfig();
    const currentZoomLevel = config.zoomViewportToLevel(this.viewport.scale.y);
    if (
      currentZoomLevel !== GameConfig.ZOOM_LEVEL_FLYING &&
      this.player &&
      this.player.head
    ) {
      const center: Point = this.player?.head
        ? { x: this.player.head.position.x, y: this.player.head.position.y }
        : this.viewport.center;
      const lineOfSight = config.getAvatarLineOfSightByZoomLevel(
        currentZoomLevel
      );
      const visionOfSightRadius =
        this.player.head.position.scaleX * lineOfSight;

      let s: Sprite | undefined = this.container?.getChildByName(
        name
      ) as Sprite;
      if (!s) {
        s = new Sprite();
        s.name = name;

        const g: Graphics = new Graphics();
        g.alpha = 0.2;
        s.addChild(g);
        this.container?.addChild(s);
      }
      s.position.set(center.x, center.y);
      const g: Graphics = s.getChildAt(0) as Graphics;
      g.clear();
      g.beginFill(0xc3b4a3);
      g.drawCircle(0, 0, visionOfSightRadius);
      g.endFill();
    } else {
      let s: Sprite | undefined = this.container?.getChildByName(
        name
      ) as Sprite;
      if (s) {
        this.container?.removeChild(s);
      }
    }
  }

  private updateBubbling(): void {
    if (Math.random() > 0.05) {
      return;
    }

    for (
      let node: BotNode | null | undefined = this.bots?.head;
      node;
      node = node?.next
    ) {
      if (Math.random() < 0.01) {
        this.creator.createBubble(node.bot.data.id, "Hello from debug!!!");
        return;
      }
    }
  }

  private handleViewprotAdded = (node: ViewportNode): void => {
    if (node.viewport.zoomLevel !== this.currentZoom) {
      this.zoomUpdated = true;
    }
  };

  private drawVenuesInnerCircle(): void {
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

  private drawVenuesOuterCircle(): void {
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

  private drawPlayaBorderCircle(): void {
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

  private venueAdded = (node: VenueNode): void => {
    const g: Graphics = new Graphics();
    g.position.set(node.position.x, node.position.y);
    g.name = node.venue.model.id;
    g.beginFill(0x0000ff);
    g.drawCircle(0, 0, node.collision.radius);
    g.endFill();
    g.alpha = 0.1;
    this.container?.addChild(g);
  };

  private venueRemoved = (node: VenueNode): void => {
    const displayObject:
      | DisplayObject
      | null
      | undefined = this.container?.getChildByName(node.venue.model.id);
    if (displayObject) {
      this.container?.removeChild();
    }
  };
}
