import { GameInstance } from "../GameInstance";
import { Point } from "../utils/Point";

import Command from "./Command";

export default class WaitClickForHeroCreation implements Command {
  public clickPoint: Point | null = null;

  public execute(): Promise<Command> {
    this.clickPoint = GameInstance.instance
      .getConfig()
      .playgroundMap.getRandomPointInTheCentralCircle();

    return Promise.resolve(this);
  }
}
