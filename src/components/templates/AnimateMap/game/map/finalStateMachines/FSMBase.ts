import { EntityStateMachine } from "@ash.ts/ash";

export class FSMBase extends EntityStateMachine {
  public currentStateName = "";

  changeState(name: string): void {
    super.changeState(name);

    this.getStateNames().forEach((stateName) => {
      if (stateName === name) {
        this.currentStateName = name;
      }
    });
  }
}
