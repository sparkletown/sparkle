import { GameUser } from "../../common";
import { FSMBase } from "../finalStateMachines/FSMBase";

export class BotComponent {
  get IDLE(): string {
    return "idle";
  }
  get MOVING(): string {
    return "moving";
  }
  get IMMOBILIZED(): string {
    return "immobilized";
  }

  constructor(
    public data: GameUser,
    public fsm: FSMBase,
    public realUser = false
  ) {}
}
