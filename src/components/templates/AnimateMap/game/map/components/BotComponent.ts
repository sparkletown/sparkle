import { ReplicatedUser } from "../../../../GameInstanceCommonInterfaces";
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
    public data: ReplicatedUser,
    public fsm: FSMBase,
    public realUser = false
  ) {}
}
