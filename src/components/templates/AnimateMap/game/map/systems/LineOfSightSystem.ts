import { Engine, NodeList, System } from "@ash.ts/ash";

import { Point } from "types/utility";

import { GameConfig } from "../../common";
import { GameInstance } from "../../GameInstance";
import { AvatarTuningComponent } from "../components/AvatarTuningComponent";
import EntityFactory from "../entities/EntityFactory";
import { AvatarTuningNode } from "../nodes/AvatarTuningNode";
import { BotNode } from "../nodes/BotNode";
import { PlayerNode } from "../nodes/PlayerNode";
import { ViewportNode } from "../nodes/ViewportNode";

export class LineOfSightSystem extends System {
  private creator: EntityFactory;
  private player?: NodeList<PlayerNode>;
  private avatars?: NodeList<AvatarTuningNode>;
  private bots?: NodeList<BotNode>;
  private viewport?: NodeList<ViewportNode>;

  private currentZoomLevel = -1;
  private lineOfSightRadius = 0;

  constructor(creator: EntityFactory) {
    super();
    this.creator = creator;
  }

  addToEngine(engine: Engine) {
    this.player = engine.getNodeList(PlayerNode);
    this.viewport = engine.getNodeList(ViewportNode);
    this.avatars = engine.getNodeList(AvatarTuningNode);

    this.bots = engine.getNodeList(BotNode);
  }

  removeFromEngine(engine: Engine) {
    this.avatars = undefined;
    this.player = undefined;
    this.viewport = undefined;
    this.bots = undefined;
  }

  update(time: number) {
    if (
      !this.player ||
      !this.player.head ||
      !this.viewport ||
      !this.viewport.head
    ) {
      return;
    }

    this.currentZoomLevel = this.viewport.head.viewport.zoomLevel;
    if (
      this.currentZoomLevel ===
      GameInstance.instance.getConfig().ZOOM_LEVEL_FLYING
    ) {
      for (
        let node: AvatarTuningNode | null | undefined = this.avatars?.head;
        node;
        node = node.next
      ) {
        this.creator.removeAvatarTuning(node);
      }
      return;
    }

    const config: GameConfig = GameInstance.instance.getConfig();
    const center: Point = {
      x: this.player.head.position.x,
      y: this.player.head.position.y,
    };
    const lineOfSight = config.getAvatarLineOfSightByZoomLevel(
      this.currentZoomLevel
    );
    this.lineOfSightRadius =
      this.player.head.position.scaleX * lineOfSight * 10;

    const minX = center.x - this.lineOfSightRadius;
    const maxX = center.x + this.lineOfSightRadius;
    const minY = center.y - this.lineOfSightRadius;
    const maxY = center.y + this.lineOfSightRadius;
    for (
      let bot: BotNode | null | undefined = this.bots?.head;
      bot;
      bot = bot.next
    ) {
      if (
        bot.position.x < minX ||
        bot.position.x > maxX ||
        bot.position.y < minY ||
        bot.position.y > maxY
      ) {
        continue;
      }

      const deltaX = center.x - bot.position.x;
      const deltaY = center.y - bot.position.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      if (distance > this.lineOfSightRadius) {
        continue;
      }

      if (bot.entity.get(AvatarTuningComponent)) {
        continue;
      }

      this.creator.updateBotTuning(bot);
    }

    for (
      let bot: AvatarTuningNode | null | undefined = this.avatars?.head;
      bot;
      bot = bot.next
    ) {
      const deltaX = center.x - bot.position.x;
      const deltaY = center.y - bot.position.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      if (distance < this.lineOfSightRadius) {
        continue;
      }

      this.creator.removeAvatarTuning(bot);
    }
  }
}
