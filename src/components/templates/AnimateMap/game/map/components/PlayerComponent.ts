import { EntityStateMachine } from "@ash.ts/ash";

import { ReplicatedUser } from "store/reducers/AnimateMap";

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

  constructor(public data: ReplicatedUser, public fsm: EntityStateMachine) {}
}
