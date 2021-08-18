import { Point } from "types/utility";

import { GameInstance } from "../GameInstance";

import Command from "./Command";

export default class WaitClickForHeroCreation implements Command {
  public clickPoint?: Point;

  public execute(): Promise<WaitClickForHeroCreation> {
    this.clickPoint = GameInstance.instance
      .getConfig()
      .playgroundMap.getRandomPointInTheCentralCircle();

    return Promise.resolve(this);
  }
}
