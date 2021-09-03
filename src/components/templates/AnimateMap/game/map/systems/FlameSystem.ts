import { Engine, System } from "@ash.ts/ash";

import { GameInstance } from "../../GameInstance";
import EntityFactory from "../entities/EntityFactory";

export class FlameSystem extends System {
  private START_TIME = Date.now();
  private ENTITY_NAME = "flame";

  constructor(private creator: EntityFactory) {
    super();
  }

  addToEngine(engine: Engine): void {}

  removeFromEngine(engine: Engine): void {}

  update(time: number): void {
    if (Date.now() <= this.START_TIME) {
      return;
    }

    let entity = this.creator.engine.getEntityByName(this.ENTITY_NAME);
    if (entity) {
      return;
    }

    const config = GameInstance.instance.getConfig();
    entity = this.creator.createFlame(
      config.worldWidth / 2,
      config.worldHeight / 2
    );
    entity.name = this.ENTITY_NAME;
  }
}
