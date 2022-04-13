import { ReplicatedUser } from "../../../GameInstanceCommonInterfaces";
import { FSMBase } from "../finalStateMachines/FSMBase";

export class PlayerComponent {
  get WALKING(): string {
    return "walking";
  }
  get CYCLING(): string {
    return "cycling";
  }
  get FLYING(): string {
    return "flying";
  }
  get IMMOBILIZED(): string {
    return "immobilized";
  }

  constructor(public data: ReplicatedUser, public fsm: FSMBase) {}
}
