import { GamePoint } from "../common";
import { GameInstance } from "../GameInstance";

import Command from "./Command";

export default class WaitClickForHeroCreation implements Command {
  public clickPoint?: GamePoint;

  public execute(): Promise<WaitClickForHeroCreation> {
    this.clickPoint = GameInstance.instance.playgroundMap.getRandomPointInTheCentralCircle();

    return Promise.resolve(this);
  }
}
