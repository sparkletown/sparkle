import { ReplicatedVenue } from "store/reducers/AnimateMap";

import { FSMBase } from "../finalStateMachines/FSMBase";

export class VenueComponent {
  get WITHOUT_HALO(): string {
    return "withoutHalo";
  }
  get HALO(): string {
    return "halo";
  }
  get HALO_ANIMATED(): string {
    return "haloAnimated";
  }
  constructor(public model: ReplicatedVenue, public fsm: FSMBase) {}
}
