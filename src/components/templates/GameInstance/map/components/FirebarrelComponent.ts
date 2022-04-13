import { ReplicatedFirebarrel } from "../../../GameInstanceCommonInterfaces";
import { FSMBase } from "../finalStateMachines/FSMBase";

export class FirebarrelComponent {
  get WITHOUT_HALO(): string {
    return "withoutHalo";
  }
  get HALO(): string {
    return "halo";
  }
  get HALO_ANIMATED(): string {
    return "haloAnimated";
  }

  constructor(public model: ReplicatedFirebarrel, public fsm: FSMBase) {}
}
