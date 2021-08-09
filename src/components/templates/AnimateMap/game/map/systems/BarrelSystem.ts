import { Engine, System, NodeList } from "@ash.ts/ash";
import { AvatarTuningNode } from "../nodes/AvatarTuningNode";
import { PlayerNode } from "../nodes/PlayerNode";
import { BarrelNode } from "../nodes/BarrelNode";

export class VideoChatSystem extends System {
  private bots: NodeList<AvatarTuningNode> | null = null;
  private player: NodeList<PlayerNode> | null = null;
  private barrels: NodeList<BarrelNode> | null = null;

  addToEngine(engine: Engine): void {
    this.bots = engine.getNodeList(AvatarTuningNode);
    this.player = engine.getNodeList(PlayerNode);
    this.barrels = engine.getNodeList(BarrelNode);
  }

  removeFromEngine(engine: Engine): void {
    this.bots = null;
    this.player = null;
    this.barrels = null;
  }

  update(time: number): void {
    if (!this.player?.head || !this.barrels?.head) {
      return;
    }
  }
}
