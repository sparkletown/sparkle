import { EntityStateMachine } from "@ash.ts/ash";

import { ReplicatedUser } from "store/reducers/AnimateMap";

export class PlayerComponent {
  constructor(public data: ReplicatedUser, public fsm: EntityStateMachine) {}
}
