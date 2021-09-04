import { Engine, System } from "@ash.ts/ash";

// import {FLAME_JSON, FLAME_PNG} from "../../constants/AssetConstants";
import { GameInstance } from "../../GameInstance";
import { SpriteComponent } from "../components/SpriteComponent";
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
      const spriteComponent = entity.get(SpriteComponent);
      if (
        spriteComponent &&
        spriteComponent.view &&
        spriteComponent.view.parent
      ) {
        // TODO need above all other sprites
        spriteComponent.view.parent.addChild(spriteComponent.view);
      }
      return;
    }

    const config = GameInstance.instance.getConfig();
    entity = this.creator.createFlame(
      config.worldWidth / 2,
      config.worldHeight / 2
    );
    entity.name = this.ENTITY_NAME;

    this.loadTexture().then(() => {
      console.log("SHOW FLAME");
      // add animation to entity.get(SpriteComponent).view
    });
  }

  private loadTexture(): Promise<void> {
    return Promise.resolve();
    // return new Promise((resolve) => {
    //   Loader.shared.add('atlas', FLAME_JSON).add('texture', FLAME_PNG).load((resources) => {
    //     console.log('LOADED!!!!!!!!!!!!!!!!!!!')
    //     // resources['atlas'].texture['']
    //     console.log(Loader.shared.resources["atlas"])
    //
    //     resolve();
    //   })
    // });
  }
}
