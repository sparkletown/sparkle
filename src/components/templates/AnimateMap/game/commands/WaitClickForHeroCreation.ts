import { Point } from "types/utility";

import { GameInstance } from "../GameInstance";

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
